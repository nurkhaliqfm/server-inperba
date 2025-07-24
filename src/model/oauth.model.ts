export class OauthAuthRequest {
  grant_type: string;
  username: string;
  password: string;
}

export class OauthResponse {
  expires_in: number;
  access_token: string;
  name: string;
  role: string;
}

export class OauthAuthResponse {
  name: string;
  role: string;
}

export class JWTMiddlewareRequest {
  id_auth: number;
  id_user: number;
}
