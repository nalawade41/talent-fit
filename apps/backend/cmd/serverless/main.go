package main

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/talent-fit/backend/internal/config"
	"github.com/talent-fit/backend/internal/server"
)

var ginLambda *ginadapter.GinLambda

// init initializes the Gin application for Lambda
func init() {
	log.Println("Lambda cold start - initializing application...")
	
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Create server instance
	srv, err := server.NewServer(cfg)
	if err != nil {
		log.Fatalf("Failed to create server: %v", err)
	}

	// Get the Gin router
	router := srv.GetRouter()

	// Initialize the Gin Lambda adapter
	ginLambda = ginadapter.New(router)
	
	log.Println("Lambda initialization complete")
}

// Handler is the Lambda function handler
func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Proxy the request to Gin
	response, err := ginLambda.ProxyWithContext(ctx, req)
	if err != nil {
		fmt.Println(fmt.Sprintf("Error while processing the Lambda request: %v", err.Error()))
		return events.APIGatewayProxyResponse{}, err
	}
	return response, nil
}

func main() {
	// Start the Lambda handler
	lambda.Start(Handler)
}
