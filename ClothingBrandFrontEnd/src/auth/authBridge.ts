// filepath: d:\spring projects\Clothing Brand\ClothingBrandFrontEnd\src\auth\authBridge.ts
class AuthBridge {
  private _accessToken: string | null = null;
  getAccessToken() { return this._accessToken; }
  setAccessToken(token: string | null) { this._accessToken = token; }
  logout = () => {};
  setTokens = (_a: string, _r: string) => {};
}
export const auth = new AuthBridge();