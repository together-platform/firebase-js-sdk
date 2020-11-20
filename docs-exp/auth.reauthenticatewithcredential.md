<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@firebase/auth](./auth.md) &gt; [reauthenticateWithCredential](./auth.reauthenticatewithcredential.md)

## reauthenticateWithCredential() function

Re-authenticates a user using a fresh credential.

<b>Signature:</b>

```typescript
export declare function reauthenticateWithCredential(user: externs.User, credential: externs.AuthCredential): Promise<externs.UserCredential>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  user | externs.[User](./auth-types.user.md) | The user. |
|  credential | externs.[AuthCredential](./auth-types.authcredential.md) | The auth credential. |

<b>Returns:</b>

Promise&lt;externs.[UserCredential](./auth-types.usercredential.md)<!-- -->&gt;

## Remarks

Use before operations such as [updatePassword()](./auth.updatepassword.md) that require tokens from recent sign-in attempts. This method can be used to recover from a  error.
