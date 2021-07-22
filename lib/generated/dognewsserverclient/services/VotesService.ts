/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Vote } from '../models/Vote';
import { request as __request } from '../core/request';

export class VotesService {

    /**
     * Votes detail and delete. We allow a subset of functionality, the rest must go
     * through /moderatedsubmission/<pk>/votes
     *
     * **Permissions:**
     * + `IsAuthenticated`: *Rejects all operations if the user is not authenticated*
     * + `IsOwnerOrModeratorOrStaff`: *Blocks update/partial_updated/destroy if:     * the user is NOT in the staff group     * AND if the model has a property called 'owner' and its value differs from the request user     * AND if the user is not in the Moderators group     Everything else is allowed*
     * + `DjangoModelPermissions`: *The request is authenticated using `django.contrib.auth` permissions.     See: https://docs.djangoproject.com/en/dev/topics/auth/#permissions      It ensures that the user is authenticated, and has the appropriate     `add`/`change`/`delete` permissions on the model.      This permission can only be applied against view classes that     provide a `.queryset` attribute.*
     * @param id A unique integer value identifying this vote.
     * @result Vote
     * @throws ApiError
     */
    public static async votesRead(
        id: number,
    ): Promise<Vote> {
        const result = await __request({
            method: 'GET',
            path: `/votes/${id}`,
        });
        return result.body;
    }

    /**
     * Votes detail and delete. We allow a subset of functionality, the rest must go
     * through /moderatedsubmission/<pk>/votes
     *
     * **Permissions:**
     * + `IsAuthenticated`: *Rejects all operations if the user is not authenticated*
     * + `IsOwnerOrModeratorOrStaff`: *Blocks update/partial_updated/destroy if:     * the user is NOT in the staff group     * AND if the model has a property called 'owner' and its value differs from the request user     * AND if the user is not in the Moderators group     Everything else is allowed*
     * + `DjangoModelPermissions`: *The request is authenticated using `django.contrib.auth` permissions.     See: https://docs.djangoproject.com/en/dev/topics/auth/#permissions      It ensures that the user is authenticated, and has the appropriate     `add`/`change`/`delete` permissions on the model.      This permission can only be applied against view classes that     provide a `.queryset` attribute.*
     * @param id A unique integer value identifying this vote.
     * @result any
     * @throws ApiError
     */
    public static async votesDelete(
        id: number,
    ): Promise<any> {
        const result = await __request({
            method: 'DELETE',
            path: `/votes/${id}`,
        });
        return result.body;
    }

}