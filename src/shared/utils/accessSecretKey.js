import {SecretManagerServiceClient} from '@google-cloud/secret-manager';

/*
 Copyright (C) 2022 Eunimart Omnichannel Pvt Ltd. (www.eunimart.com)
 All rights reserved.
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License v3.0 as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License v3.0 for more details.
 You should have received a copy of the GNU Lesser General Public License v3.0
 along with this program.  If not, see <https://www.gnu.org/licenses/lgpl-3.0.html/>.
*/

/**
 * Access the secret key
 * @param {String} versionName 
 * @returns 
 */
async function accessSecretVersion(versionName) {
  const client = new SecretManagerServiceClient({
    projectId: process.env.FIREBASE_PROJECT_ID, 
    keyFilename: process.env.FIREBASE_JUSPAY_SERVICE_ACCOUNT
  });
    
  const [accessResponse] = await client.accessSecretVersion({
    name: versionName,
  });

  const responsePayload = accessResponse.payload.data.toString('utf8');
  return responsePayload
}

export { accessSecretVersion};