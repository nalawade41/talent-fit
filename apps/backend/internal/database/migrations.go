package database

import (
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"
	"sort"
	"strings"

	"gorm.io/gorm"
)

// MigrationRunner handles SQL migration execution
type MigrationRunner struct {
	db            *gorm.DB
	migrationsDir string
}

// NewMigrationRunner creates a new migration runner
func NewMigrationRunner(db *gorm.DB, migrationsDir string) *MigrationRunner {
	return &MigrationRunner{
		db:            db,
		migrationsDir: migrationsDir,
	}
}

// RunMigrations executes all pending SQL migrations
func (m *MigrationRunner) RunMigrations() error {
	log.Printf("Starting SQL migrations from directory: %s", m.migrationsDir)

	// Create migrations tracking table if it doesn't exist
	if err := m.createMigrationsTable(); err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	// Get list of migration files
	migrationFiles, err := m.getMigrationFiles()
	if err != nil {
		return fmt.Errorf("failed to get migration files: %w", err)
	}

	// Execute each migration
	for _, file := range migrationFiles {
		if err := m.executeMigration(file); err != nil {
			return fmt.Errorf("failed to execute migration %s: %w", file, err)
		}
	}

	log.Printf("All SQL migrations completed successfully")
	return nil
}

// createMigrationsTable creates the migrations tracking table
func (m *MigrationRunner) createMigrationsTable() error {
	sql := `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version VARCHAR(255) PRIMARY KEY,
			executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);
	`
	return m.db.Exec(sql).Error
}

// getMigrationFiles returns sorted list of migration files
func (m *MigrationRunner) getMigrationFiles() ([]string, error) {
	files, err := ioutil.ReadDir(m.migrationsDir)
	if err != nil {
		return nil, err
	}

	var migrationFiles []string
	for _, file := range files {
		if !file.IsDir() && strings.HasSuffix(file.Name(), ".sql") {
			migrationFiles = append(migrationFiles, file.Name())
		}
	}

	// Sort files to ensure proper execution order
	sort.Strings(migrationFiles)
	return migrationFiles, nil
}

// executeMigration executes a single migration file
func (m *MigrationRunner) executeMigration(filename string) error {
	// Check if migration already executed
	var count int64
	err := m.db.Raw("SELECT COUNT(*) FROM schema_migrations WHERE version = ?", filename).Scan(&count).Error
	if err != nil {
		return err
	}

	if count > 0 {
		log.Printf("Migration %s already executed, skipping", filename)
		return nil
	}

	// Read migration file
	filePath := filepath.Join(m.migrationsDir, filename)
	content, err := ioutil.ReadFile(filePath)
	if err != nil {
		return err
	}

	log.Printf("Executing migration: %s", filename)

	// Execute migration in a transaction
	return m.db.Transaction(func(tx *gorm.DB) error {
		// Execute the SQL
		if err := tx.Exec(string(content)).Error; err != nil {
			return err
		}

		// Record migration as executed
		return tx.Exec("INSERT INTO schema_migrations (version) VALUES (?)", filename).Error
	})
}

// RollbackMigration rolls back a specific migration (if rollback SQL is provided)
func (m *MigrationRunner) RollbackMigration(version string) error {
	// This is a basic implementation - in a full system you'd have separate rollback files
	log.Printf("Rollback functionality not implemented for version: %s", version)
	return fmt.Errorf("rollback not implemented - manual intervention required")
}

// GetExecutedMigrations returns list of executed migrations
func (m *MigrationRunner) GetExecutedMigrations() ([]string, error) {
	var versions []string
	err := m.db.Raw("SELECT version FROM schema_migrations ORDER BY version").Scan(&versions).Error
	return versions, err
}
