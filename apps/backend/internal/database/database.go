package database

import (
	"fmt"
	"log"
	"path/filepath"

	"github.com/talent-fit/backend/internal/config"
	"github.com/talent-fit/backend/internal/entities"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Database holds the database connection
type Database struct {
	DB *gorm.DB
}

// NewDatabase creates a new database connection
func NewDatabase(cfg *config.Config) (*Database, error) {
	// Get database connection string
	dsn := cfg.GetDatabaseConnectionString()

	log.Printf("Connecting to database...")

	// Configure GORM logger based on environment
	var gormLogger logger.Interface
	if cfg.IsDevelopment() {
		gormLogger = logger.Default.LogMode(logger.Info)
	} else {
		gormLogger = logger.Default.LogMode(logger.Silent)
	}

	// Connect to database
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: gormLogger,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Get underlying SQL DB for connection configuration
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	// Configure connection pool
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)

	log.Printf("Database connected successfully")

	return &Database{
		DB: db,
	}, nil
}

// Close closes the database connection
func (d *Database) Close() error {
	sqlDB, err := d.DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}

// AutoMigrate runs database migrations
func (d *Database) AutoMigrate() error {
	log.Printf("Running database migrations...")

	// First run SQL migrations
	if err := d.RunSQLMigrations(); err != nil {
		return fmt.Errorf("failed to run SQL migrations: %w", err)
	}

	// Then run GORM auto-migrate as fallback/sync
	err := entities.AutoMigrate(d.DB)
	if err != nil {
		return fmt.Errorf("failed to run GORM auto-migrate: %w", err)
	}

	log.Printf("Database migrations completed")
	return nil
}

// RunSQLMigrations runs SQL migration files
func (d *Database) RunSQLMigrations() error {
	// Get the migrations directory path
	migrationsDir := filepath.Join("migrations")
	
	// Create migration runner
	runner := NewMigrationRunner(d.DB, migrationsDir)
	
	// Execute migrations
	return runner.RunMigrations()
}
