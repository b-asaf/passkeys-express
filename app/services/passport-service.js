const passport = require("passport");
const WebAuthnStrategy = require("passport-fido2-webauthn");

const models = require("../models");
const db = require("../../db/helpers/init");

class PassportService {
  init(store) {
    // 1. configure passport to use WebAuthn Strategy
    passport.use(this.useWebAuthnStrategy(store));

    // 2. passport serialize user -
    // Regular JS object containing details and converting into encrypted string (i.e TOKEN)
    passport.serializeUser(this.serializeUserFn);

    // 3. passport deserialize user -
    // Extracting details from Token, encrypted string
    passport.deserializeUser(this.deserializeUserFn);
  }

  useWebAuthnStrategy(store) {
    return new WebAuthnStrategy(
      { store },
      this.verify, // main goal - find the relevant user and retrieve the public key
      this.register // main goal - create a new user and new associated public key credentials and store it in the DBs
    );
  }

  serializeUserFn(user, doneCb) {
    // TBD - read about this nextTick in NodeJS context
    process.nextTick(() => {
      doneCb(null, { id: user.id, email: user.email });
    });
  }

  deserializeUserFn(user, doneCb) {
    process.nextTick(() => {
      doneCb(null, user);
    });
  }

  // Async function due to the fact it will interact with DB
  async verify(id, userHandle, doneCb) {
    const transaction = await db.transaction();

    try {
      // Find PublicKeyCredentials for current user by id
      const currentCredentials = await models.PublicKeyCredentials.findOne(
        { where: { external_id: id } },
        { transaction }
      );

      if (currentCredentials === null) {
        return doneCb(null, false, { message: "Invalid key." });
      }

      // Find Associated User by public key's
      const currentUser = await models.User.findOne(
        { where: { user_id: currentCredentials.user_id } },
        { transaction }
      );

      if (currentUser === null) {
        return doneCb(null, false, { message: "User can't be found." });
      }

      // Compare user record's handle to the handle we pass in
      if (Buffer.compare(currentUser.handle, userHandle) !== 0) {
        return doneCb(null, false, { message: "Handles does not match." });
      }

      await transaction.commit();

      return doneCb(null, currentCredentials, currentCredentials.public_key);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Async function due to the fact it will interact with DB
  async register(user, id, publicKey, doneCb) {
    const transaction = await db.transaction();

    try {
      const newUser = await models.User.create(
        {
          email: user.email,
          handle: user.id,
        },
        { transaction }
      );

      if (newUser === null) {
        return doneCb(null, false, { message: "Could not create new user" });
      }

      const newPublicKeyCredentials = await models.PublicKey.create(
        {
          user_id: newUser.id,
          external_id: id,
          public_key: publicKey,
        },
        { transaction }
      );

      if (newPublicKeyCredentials === null) {
        return doneCb(null, false, {
          message: "Could not create new public key",
        });
      }

      await transaction.commit();
      return doneCb(null, newUser);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = PassportService;
