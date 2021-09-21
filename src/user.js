/**
 * @typedef {Object} UserData
 * @property {string} username - The username of the user
 * @property {number} avatar - The file ID where the user's avatar is stored
 * @property {string} createDate - The date string of the user's creation
 * @property {{string|undefined}} [special]
 * @property {boolean} banned
 * @property {boolean} super
 * @property {boolean} registered
 * @property {boolean} id
 */

/**
 * User wraps around userdata and provides an interface for other actions
 * @class
 * @constructor
 * @public
 * @implements {UserData}
 */
class User {
    /**
     * @param {UserData} userData - The user data as it is formatted on the API
     * @param {string} apiURL - The API URL from which the user data was grabbed
     */
    constructor(userData, apiURL) {
        Object.assign(this, userData);
        /**
         * @type {string}
         * @public
         */
        this.username = userData.username;
        /**
         * @type {number}
         * @public
         */
        this.avatar = userData.avatar;
        /**
         * @type {string}
         * @public
         */
        this.createDate = userData.createDate;
        /**
         * @type {{string|undefined}}
         * @public
         */
        this.special = userData.special;
        /**
         * @type {boolean}
         * @public 
         */
        this.banned = userData.banned;
        /**
         * Whether the user has special permissions or not
         * @type {boolean}
         * @public
         */
        this.super = userData.super;
        /**
         * @type {boolean}
         * @public
         */
        this.registered = userData.registered;
        /**
         * @type {number}
         * @public
         */
        this.id = userData.id;
        /**
         * The API URL from which the data was grabbed
         * @type {string}
         * @private
         */
        this.apiURL = apiURL;
    }

    /**
     * Generates an avatar link given the available information about the user
     * @param {number} size - The size of the avatar in pixels
     * @returns {string} A URL to the avatar on the API formatted correctly
     */
    getAvatarLink(size = 256) {
        return `${this.apiURL}File/raw/${this.avatar}?size=${size}&crop=true`
    }
}