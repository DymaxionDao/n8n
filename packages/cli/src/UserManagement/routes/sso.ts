/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from 'axios';
import { Response } from 'express';
import { Db, ResponseHelper } from '../..';
import { Role } from '../../databases/entities/Role';
import { User } from '../../databases/entities/User';
import type { SsoLoginRequest } from '../../requests';
import { issueCookie } from '../auth/jwt';
import { N8nApp, PublicUser, SsoUser } from '../Interfaces';
import { sanitizeUser } from '../UserManagementHelper';

export function ssoApis(this: N8nApp): void {
	const syncUser = async (reqUser: SsoUser): Promise<User> => {
		const checkUser = await Db.collections.User.findOne(
			{
				email: reqUser.email,
			},
			{
				relations: ['globalRole'],
			},
		);
		if (checkUser) {
			return checkUser;
		}
		const role = (await Db.collections.Role.findOne({ scope: 'global', name: 'member' })) as Role;

		const user = new User();
		user.email = reqUser.email;
		user.firstName = reqUser.name;
		user.lastName = '';
		user.globalRole = role;

		const newuser = await Db.collections.User.save(user);
		return newuser;
	};

	this.app.get(
		`/${this.restEndpoint}/sso/callback`,
		ResponseHelper.send(async (req: SsoLoginRequest, res: Response): Promise<PublicUser> => {
			if (!req.query.tokken) {
				throw new Error('Tokken is required');
			}

			const SSO_URL = `${process.env.SSO_URL as string}/sso/user?sso_session_tokken=${
				req.query.tokken
			}`;
			console.log('SSO_URL', SSO_URL);

			// let user;
			try {
				const responseData = await axios.get(SSO_URL);
				if (responseData.status !== 200) {
					throw new Error('SSO server returns error');
				}
				const apiResdata = responseData.data.user as SsoUser;

				if (!apiResdata) {
					throw new Error('SSO server returns error');
				}

				const user = await syncUser(apiResdata);

				await issueCookie(res, user);

				return sanitizeUser(user);
			} catch (error) {
				throw new Error(`Error With Sso`);
			}

			// return sanitizeUser(user);
			// return user as PublicUser;
		}),
	);
}
