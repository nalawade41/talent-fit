package entities

import "gorm.io/gorm"

// AllEntities returns a slice of all entity structs for migration
func AllEntities() []interface{} {
	return []interface{}{
		&User{},
		&EmployeeProfile{},
		&Project{},
		&ProjectAllocation{},
		&Notification{},
	}
}

// AutoMigrate runs auto migration for all entities
func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(AllEntities()...)
}
