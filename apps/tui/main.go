package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/ssh"
	"github.com/charmbracelet/wish"
	"github.com/charmbracelet/wish/bubbletea"
	"github.com/charmbracelet/wish/logging"
)

const defaultPocketBaseURL = "http://127.0.0.1:8090"

var (
	titleStyle = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("86"))
	boxStyle   = lipgloss.NewStyle().Border(lipgloss.RoundedBorder()).Padding(1, 2)
	mutedStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("244"))
)

type model struct {
	user          string
	pocketBaseURL string
	status        string
}

type statusMsg string

func newModel(user string) model {
	if user == "" {
		user = "anonymous"
	}

	return model{
		user:          user,
		pocketBaseURL: env("POCKETBASE_URL", defaultPocketBaseURL),
		status:        "checking PocketBase...",
	}
}

func (m model) Init() tea.Cmd {
	return checkPocketBase(m.pocketBaseURL)
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		if msg.String() == "ctrl+c" || msg.String() == "q" {
			return m, tea.Quit
		}
	case statusMsg:
		m.status = string(msg)
	}

	return m, nil
}

func (m model) View() string {
	return boxStyle.Render(
		titleStyle.Render("PocketBase Portfolio")+"\n\n"+
			fmt.Sprintf("Hello, %s. This SSH app is powered by Wish and Bubble Tea.\n\n", m.user)+
			fmt.Sprintf("PocketBase: %s\n", m.status)+
			mutedStyle.Render("\nPress q to close the session."),
	) + "\n"
}

func main() {
	host := env("TUI_HOST", "0.0.0.0")
	port := env("TUI_PORT", "2222")

	server, err := wish.NewServer(
		wish.WithAddress(net.JoinHostPort(host, port)),
		wish.WithHostKeyPath(env("TUI_HOST_KEY_PATH", ".ssh/portfolio_ed25519")),
		wish.WithMiddleware(
			bubbletea.Middleware(func(session ssh.Session) (tea.Model, []tea.ProgramOption) {
				return newModel(session.User()), []tea.ProgramOption{tea.WithAltScreen()}
			}),
			logging.Middleware(),
		),
	)
	if err != nil {
		log.Fatal(err)
	}

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Printf("SSH TUI listening on %s", net.JoinHostPort(host, port))
		if err := server.ListenAndServe(); err != nil {
			log.Printf("SSH server stopped: %v", err)
		}
	}()

	<-done

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("SSH server shutdown failed: %v", err)
	}
}

func checkPocketBase(baseURL string) tea.Cmd {
	return func() tea.Msg {
		client := http.Client{Timeout: 2 * time.Second}
		response, err := client.Get(baseURL + "/api/portfolio/health")
		if err != nil {
			return statusMsg("waiting for " + baseURL)
		}
		defer response.Body.Close()

		if response.StatusCode >= http.StatusBadRequest {
			return statusMsg(fmt.Sprintf("%s returned %s", baseURL, response.Status))
		}

		return statusMsg("connected at " + baseURL)
	}
}

func env(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}
