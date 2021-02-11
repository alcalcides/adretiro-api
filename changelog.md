# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.23.2] - 2021-02-10
### Fixed
- Ignores sql dump files

### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons

## [0.23.1] - 2021-02-10
### Changed
- Labels have 5 characters

### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons

## [0.23.0] - 2021-02-09
### Added
- Retrieves contributor data

### Changed
- Renames from findByID to findByID_REST in people controller

### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons

## [0.22.1] - 2021-02-08
### Added
- Orders the resource 'contributions' by 'id'

### Changed
- Renames properties returned by 'contributions'

### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons

## [0.22.0] - 2021-02-08
### Added
- Launches the resource 'contributions'

### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons

## [0.21.2] - 2021-02-07
### Fixed
- Completes contribution registry pipeline

### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons

## [0.21.1] - 2021-02-07
### Changed
- Renames resource name from 'registry' to 'create'

### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons

## [0.21.0] - 2021-02-06
### Added
- Registries the contributions

### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons

## [0.20.0] - 2021-02-06
### Added
- Lists contributors' full Name and username

### Removed
- Route thats read table 'contributor'

### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons


## [0.19.4] - 2021-02-03
### Fixed
- Supports people not enrolled in departments

### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons

## [0.19.3] - 2021-02-03
### Fixed
- Deletes register of table 'passwords' when contributor creation faults
- Deletes resource 'read' in table passwords

### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons

## [0.19.2] - 2021-01-30
### Fixed
- Establishes a pattern to payload error responses

## [0.19.1] - 2021-01-30
### Added
- Prints the time first of all, when starting

### Fixed
- Fixes password sanitization error response

### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons
- Resources insecures: table passwords

## [0.19.0] - 2021-01-30
### Added
- Updates person data
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons
- Resources insecures: table passwords

## [0.18.0] - 2021-01-23
### Added
- Lists a person's enrollments
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons
- Resources insecures: table passwords

## [0.17.5] - 2021-01-23
### Fixed
- Allows multiple values 'null' in columns with the constraint 'unique'
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons
- Resources insecures: table passwords

## [0.17.4] - 2021-01-19
### Changed
- Adds username to JWT payload
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons
- Resources insecures: table passwords

## [0.17.3] - 2021-01-16
### Fixed
- Returns writing errors in the table people
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons
- Resources insecures: table passwords

## [0.17.2] - 2021-01-16
### Fixed
- Enable all CORS requests
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons
- Resources insecures: table passwords

## [0.17.1] - 2021-01-16
### Added
- Documents creation of the table 'stickers'
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons
- Resources insecures: table passwords

## [0.17.0] - 2021-01-16
### Added
- Can fill the sheet 'stickers'
### Fixed
- Removes constraint of column fk_contributor in the sheet 'stickers'
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons
- Resources insecures: table passwords

## [0.16.0] - 2021-01-15
### Added
- Records the contributions in the database
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons
- Resources insecures: table passwords

## [0.15.0] - 2021-01-14
### Added
- Protects authenticated routes
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons
- Resources insecures: table passwords

## [0.14.0] - 2021-01-12
### Added
- Authenticates contributors and managers
- Lists all managers
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons
- Resources insecures: table passwords

## [0.13.0] - 2021-01-11
### Added
- Authorizes users with JWT
### Fixed
- Removes 'sudo' of installation scripts
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons

## [0.12.0] - 2021-01-10
### Added
- Enrolls contributors in its departments
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons

## [0.11.1] - 2021-01-09
### Added
- Cleans contributors creation algorithm
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons


## [0.11.0] - 2021-01-09
### Added
- Implements interface to database operations
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons


## [0.10.0] - 2021-01-08
### Added
- Records contributors
- Uses constants to map http status code
### Fixed
- All person must have a password
### Deprecated
- Resource to tables created by seed: departments, stickers_status and jacobs_sons


## [0.9.0] - 2021-01-04
### Added
- Creates table for encrypted passwords

## [0.8.0] - 2021-01-04
### Added
- Create all tables

## [0.7.1] - 2021-01-02
### Added
- Lists departments

## [0.7.0] - 2021-01-02
### Added
- Table 'Departments' 

## [0.6.1] - 2021-01-02
### Added
- Table 'Stickers Status' can be read

## [0.6.0] - 2021-01-02
### Added
- Table 'Stickers Status'

## [0.5.0] - 2020-12-31
### Added
- Reading of tables in database
- Documents how to perform database query with knex
- Writes "ok" in console when the application is started

## [0.4.0] - 2020-12-30
### Added
- Fulfillment of table Jacobs Sons with knex's feature 'seed'
- Documentation updating

### Fixed
- Automatically fill fields "created_at" and "updated_at" in database

## [0.3.1] - 2020-12-30
### Added
- Database connection description to create tables

## [0.3.0] - 2020-12-29
### Added
- Migrations to create table jacobs_sons

## [0.2.3] - 2020-12-29
### Added
- Folder "controller" to wrap objects that accesses database tables

## [0.2.2] - 2020-12-29
### Added
- Separation of responsibilities: server.js is to define port and app.js defines app logic.

### Fixed
- Routes is the variable name that contains all API's resources

## [0.2.1] - 2020-12-29
### Added
- Routes refactoring to be specific file

## [0.2.0] - 2020-12-29
### Added
- Message "Hello World" to route '/ping'
- Nodemon to automatic re-runing in development environment 

## [0.1.0] - 2020-12-28
### Added
- Respond with Error message when get url
- Instructions to run the app in development environment