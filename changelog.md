# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0]
### Added
- Fulfillment of table Jacobs Sons with knex's feature 'seed'
- Documentation updating

### Fixed
- Automatically fill fields "created_at" and "updated_at" in database

## [0.3.1] - 2020-12-30
### Added
- Database conexion description to create tables

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