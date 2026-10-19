# Property Management App

A full-stack property management platform designed to simplify short-term rental operations by connecting guests, property managers, and property owners through a mobile application and a web dashboard.

The system centralises guest services, property administration, rental agreements, payments, maintenance requests, inventory management, and housekeeping operations through a shared backend API.

## Project Overview

The project consists of three main components:

- **Mobile Application:** An Android application developed in Kotlin for guests to manage their stays and access rental services.
- **Web Application:** A minimalist web dashboard developed with React and TypeScript for property administrators to manage properties, rental agreements, inventory, and operations.
- **Backend API:** A REST API developed in Java with Spring Boot, shared by both clients and connected to a MySQL database.

The architecture is designed to provide a centralised, maintainable, and scalable solution for managing rental properties.

## Technologies

| Component | Technology | Purpose |
|---|---|---|
| Mobile App | Kotlin | Guest-facing Android application |
| Web Frontend | React + TypeScript | Property management dashboard |
| Backend | Java + Spring Boot | Business logic and REST API |
| Database | MySQL | Persistent application data |
| Payments | Stripe | Secure payment processing |
| Messaging | RabbitMQ | Asynchronous communication between services |
| Email Verification | Email verification service | Account verification and email notifications |

## Features

### Mobile Application — Kotlin

Designed primarily for guests, the mobile application provides access to the main services associated with their rental.

- **Check-in and Check-out:** Manage arrival and departure processes.
- **User Profile:** View and manage personal information.
- **Payments:** Process supported payments through Stripe.
- **Rental Agreements:** View lease details, rental dates, pricing, and relevant contract information.
- **Maintenance Requests:** Report breakdowns, damages, or other property-related issues.
- **Booking Information:** Access rental details and property information.
- **Notifications and Messaging:** Receive relevant updates and communicate with property management.

### Web Application — React and TypeScript

A minimalist administrative dashboard designed to help property managers oversee their properties and daily operations.

- **Property Management:** Create, update, and manage property records.
- **Rental Management:** View and manage bookings, rental dates, prices, and associated guests.
- **Contract Management:** Create, review, and manage rental agreements.
- **Inventory Management:** Track furniture, equipment, supplies, and other property assets.
- **Housekeeping Management:** Coordinate cleaning tasks and property preparation.
- **Maintenance Management:** Review and track reported incidents and repair requests.
- **User and Administrator Management:** Manage user accounts and administrative access.
- **Payments Overview:** Access relevant rental payment information and transaction statuses.

### Backend API — Java and Spring Boot

The backend provides a shared API for the mobile and web applications, centralising business logic, data access, authentication, and integrations.

- RESTful endpoints for properties, users, rentals, contracts, and maintenance requests.
- Authentication and role-based authorisation.
- Database access through a structured persistence layer.
- Stripe integration for payment processing and transaction status updates.
- Email verification and notification workflows.
- RabbitMQ messaging for asynchronous communication and event processing.
- Input validation and consistent error handling.

#### Backend Architecture

The backend can be organised as a modular Spring Boot application, with independent services for payments, email verification, and messaging where appropriate.

If these components are deployed independently, they can evolve into separate microservices. RabbitMQ can then facilitate asynchronous communication between services.

### Database — MySQL

The relational database stores the application's core business data and maintains relationships between users, properties, rentals, and operational records.

#### Main Tables

| Table | Description |
|---|---|
| `users` | Guest account details and personal information |
| `property_admins` | Administrative users and their relationship with managed properties |
| `properties` | Property details, descriptions, addresses, and status |
| `rentals` | Rental records linking guests and properties, including dates and agreed prices |
| `contracts` | Rental agreements associated with rentals |
| `payments` | Payment records, amounts, currency, and transaction status |
| `housekeeping` | Cleaning tasks, schedules, assignments, and completion status |
| `maintenance_requests` | Reported issues, descriptions, priority, and repair status |
| `inventory_items` | Furniture, equipment, and supplies associated with properties |
| `rental_inventory` | Optional association between rental records and inventory, if tracking per-stay usage is required |

Additional tables may be introduced for messages, notifications, audit logs, and role or permission management as the project evolves.

#### Database Relationships

- A property can have multiple rental records over time.
- A guest can have multiple rentals.
- Each rental links a guest to a property and stores the relevant rental dates and agreed price.
- A rental can have one or more associated contracts and payment records.
- A property can have multiple housekeeping tasks, maintenance requests, and inventory items.
- A property can be managed by multiple administrators, and an administrator can manage multiple properties.

The `rentals` table acts as the central relationship between guests and properties, while `property_admins` supports the assignment of administrative responsibilities.

## System Architecture

```text
+---------------------+       +----------------------+
|  Kotlin Android App |       | React + TypeScript   |
|       Guests        |       | Property Admins      |
+----------+----------+       +-----------+----------+
           |                              |
           +--------------+---------------+
                          |
                    HTTPS / REST
                          |
                +---------v----------+
                | Spring Boot API    |
                | Authentication     |
                | Business Logic     |
                | Validation         |
                +----+-----------+---+
                     |           |
             +-------v----+  +---v-----------+
             | MySQL      |  | RabbitMQ      |
             | Database   |  | Async Messages|
             +------------+  +---------------+
                     |
             +-------v----------------+
             | External Integrations   |
             | Stripe / Email Service |
             +------------------------+
```

## Security Considerations

- Use secure authentication and role-based access control.
- Protect guest information and rental agreements from unauthorised access.
- Use HTTPS for API communication.
- Store credentials and API keys in environment variables or a secrets manager.
- Never store raw payment card details in the application database.
- Verify Stripe webhook signatures before processing payment events.
- Validate user input and enforce authorisation checks on the backend.
- Restrict administrators to the properties they are authorised to manage.

## Development Status

This repository is intended to support the development of a complete property management solution. Features, integrations, database structures, and deployment procedures should be documented and updated as they are implemented.


## License

MIT License