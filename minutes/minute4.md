# Minute 4

**Date:** 31/03/2026  
**Time:** 19:00

---

## Participants

- Marta Condeço
- Gonçalo Fonseca
- Tiago Coelho
- Diego Aguilar

**Not present:** None

---

## Agenda

1. Definition of the REST API endpoints;
2. Discussion of the backend architecture (Spring Boot);
3. Planning of the containerized deployment;

## Decisions

1. REST API to be implemented with Spring Boot;
2. Endpoints defined for Animal, Barn, Farm and Manager resources (CRUD);
3. Swagger/OpenAPI to be used for API documentation;
4. Docker Compose to orchestrate all services (API, frontend, database, Keycloak, RabbitMQ);

## Tasks

1. Implement the REST API controllers (Animal, Barn, Farm, Manager);
2. Set up the Docker Compose environment;
3. Integrate Swagger for API documentation;
4. Set up the database migrations (Flyway);

---

## Additional Notes

RabbitMQ will be used for consuming animal metric events asynchronously. Keycloak will handle authentication and authorization.

---

*Minute written by: Gonçalo Fonseca*
