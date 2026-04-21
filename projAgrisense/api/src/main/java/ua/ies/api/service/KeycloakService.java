package ua.ies.api.service;

import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ua.ies.api.dto.CreateFarmerRequest;
import ua.ies.api.dto.CreateFarmerResponse;

import jakarta.ws.rs.core.Response;
import java.security.SecureRandom;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KeycloakService {

    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int PASSWORD_LENGTH = 12;

    public CreateFarmerResponse createFarmer(CreateFarmerRequest request) {
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        String temporaryPassword = generateRandomPassword();
        String username = request.email();

        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(username);
        user.setEmail(request.email());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmailVerified(true);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(temporaryPassword);
        credential.setTemporary(true);
        user.setCredentials(Collections.singletonList(credential));

        Response response = usersResource.create(user);
        
        if (response.getStatus() != 201) {
            throw new RuntimeException("Failed to create user: " + response.getStatusInfo());
        }

        String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");

        RoleRepresentation farmerRole = realmResource.roles().get("farmer").toRepresentation();
        usersResource.get(userId).roles().realmLevel().add(Collections.singletonList(farmerRole));

        return new CreateFarmerResponse(userId, username, temporaryPassword);
    }

    private String generateRandomPassword() {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);
        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            password.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return password.toString();
    }

    public List<UserRepresentation> getAllFarmers() {
        // Now 'keycloak' is properly defined as a variable above, so this will work perfectly.
        return keycloak.realm(realm).roles().get("farmer").getUserMembers();
    }
}
