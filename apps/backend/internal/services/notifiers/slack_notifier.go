package notifiers

import (
	"context"
	"fmt"
	"log"

	"github.com/slack-go/slack"
	"github.com/talent-fit/backend/internal/config"
	"github.com/talent-fit/backend/internal/domain"
)

type SlackNotifier struct {
    client  *slack.Client
    cfg     *config.Config
}

func NewSlackNotifier(cfg *config.Config) *SlackNotifier {
    if cfg.Slack.BotToken == "" {
        return nil
    }
    return &SlackNotifier{
        client: slack.New(cfg.Slack.BotToken),
        cfg:    cfg,
    }
}

func (s *SlackNotifier) Send(ctx context.Context, msg domain.NotificationMessage) error {
    if s == nil || s.client == nil {
        return nil
    }

    // Post message per recipient; DM if SlackID present, else fallback to default channel
    for _, r := range msg.Recipients {
        channelID := s.cfg.Slack.DefaultChannelID
        if r.SlackID != "" {
            // Open IM channel
            channel, _, _, err := s.client.OpenConversation(&slack.OpenConversationParameters{Users: []string{r.SlackID}, ReturnIM: true})
            if err != nil {
                log.Printf("failed to open DM with %s: %v, using default channel", r.SlackID, err)
            } else {
                channelID = channel.ID
            }
        }

        if channelID == "" {
            return fmt.Errorf("no slack channel configured and no recipient SlackID provided")
        }

        text := fmt.Sprintf("%s\n%s", msg.Subject, msg.Body)
        _, _, err := s.client.PostMessageContext(ctx, channelID, slack.MsgOptionText(text, false))
        if err != nil {
            log.Printf("failed to post slack message to %s: %v", channelID, err)
        }
    }
    return nil
}


