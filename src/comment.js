const axios = require('axios');

/**
 * @typedef {Object} Settings
 * @property {string} m - The markup type of the comment
 * @property {string} [b] - The display username as determined by a bridge
 * @property {string} [n] - Nickname
 * @property {number} [a] - Avatar file ID
 */

/**
 * @typedef {Object} CommentData
 * @property {number} parentId - The room ID where the comment will be sent
 * @property {string} content - The contents of the comments that will be sent
 * @property {string} createDate - The time string when the comment was created
 * @property {string} editDate - The time string when the comment was last edited
 * @property {number} createUserId - The ID of the user who created the comment
 * @property {number} editUserId - The ID of the user who edited the comment last
 * @property {boolean} deleted - Whether the message is deleted or not
 * @property {number} id - The internal ID of the comment
 */

/**
 * @implements {CommentData}
 */
class Comment {
    /**
     * Generate the content for a comment and send it to an API endpoint
     * @param {string} content - The content of the comment
     * @param {Settings} settings - The metadata of the comment
     * @param {number} pageId - The page ID where the comment will be sent
     * @param {string} authtoken - The auth token that is used to make authorized API requests
     * @param {string} apiURL - The endpoint where the comment will be created
     * @returns {Comment} The newly created comment
     */
    static send(content, settings, pageId, authtoken, apiURL) {
        const data = {
            content: `${JSON.stringify(settings)}\n${content}`,
            parentId: pageId,
        };
        const body = JSON.stringify(data);
        // TODO REST
    }

    /**
     * Gets a comment from an API endpoint by ID
     * @param {number} id - The ID of the comment to retrieve
     * @param {string} apiURL - The endpoint where the comment will be retrieved
     * @returns {Promise<Comment>} The comment retrieved from the API
     */
    static getByID(id, apiURL) {
        return axios.get(`${apiURL}Comment?Ids=${id}`)
            .then(response => (new Comment(response.data[0], apiURL)));
    }

    /**
     * @param {CommentData} comment - The comment data that is grabbed from an API endpoint
     * @param {string} apiURL - The API endpoint from which the comment data was grabbed
     * @param {Array<User>} userlist - A list of users that is used for reference for attaching users
     * @param {string} [authtoken] - The authtoken that is used in order to manipulate the comment further
     */
    constructor(comment, apiURL, userlist = [], authtoken) {
        /**
         * @type {number}
         * @public
         */
        this.parentId = comment.parentId;
        /**
         * @type {string}
         * @public
         */
        this.content = comment.content;
        /**
         * @type {string}
         * @public
         */
        this.createDate = comment.createDate;
        /**
         * @type {string}
         * @public
         */
        this.editDate = comment.editDate;
        /**
         * @type {number}
         * @public
         */
        this.createUserId = comment.createUserId;
        /**
         * @type {number}
         * @public
         */
        this.editUserId = comment.editUserId;
        /**
         * @type {boolean}
         * @public
         */
        this.deleted = comment.deleted;
        /**
         * @type {number}
         * @public
         */
        this.id = comment.id;
        /**
         * The token that is used to make API requests that interact with the
         * comment
         * @type {{string|undefined}}
         * @private
         */
        this.authtoken = authtoken;
        /**
         * The API URL that the comment was retrieved from and where it will be
         * interacted with
         * @type {string}
         * @private
         */
        this.apiURL = apiURL;

        const createUserData = userlist
            .find(user => user.id === this.createUserId);
        /**
         * The user who created the comment
         * @type {{User|undefined}}
         * @public
         */
        this.createUser = (createUserData) ?
            new User(createUserData, apiURL) :
            undefined;

        const editUserData = userlist
            .find(user => user.id === this.editUserData);
        /** 
         * The user who last edited the comment
         * @type {{User|undefined}}
         * @public
         */
        this.createUser = (editUserData) ?
            new User(editUserData, apiURL) :
            undefined;


        /**
         * The metadata included in the comment content
         * @type {Settings}
         * @public
         */
        this.settings = { m: 't' };
        /**
         * The content of the comment with the metadata stripped out
         * @type {string}
         * @public
         */
        this.textContent = this.content;

        // extract the metadata from the content
        try {
            const firstNewline = this.content.indexOf('\n');
            const settings = JSON.parse(
                this.content.substring(0, firstNewline)
            );
            this.settings = settings;
            this.textContent = this.content.substring(firstNewline + 1);
            // if the json couldn't be parsed, then that probably means there are no
            // settings sent in the message
        } catch (e) { }
    }
    /**
     * Edits the current comment
     * @param {string} content - The new content of the comment
     * @param {Settings} [settings] - The new settings to be applied on the comment
     * @param {string} [authtoken] - An authtoken to be used if it doesn't already exist
     * @return {Promise<Comment>}
     */
    edit(content, settings = this.settings, authtoken = this.authtoken) {
        return new Promise((resolve, reject) => {
            const newCommentData = { ...this.toJSON() };
            Object.assign(newCommentData, { content: `${JSON.stringify(settings)}\n${content}` })
            const body = JSON.stringify(newCommentData);
            if (authtoken) {
                const headers = SmileBASICSource.generateHeaders(authtoken);
                axios.put(`${this.apiURL}Comment/${this.id}`, body, { headers })
                    .then(data => resolve(new Comment(data, [this.createUser, this.editUser])))
                    .catch(err => reject(err));
            } else {
                reject("A valid authtoken isn't available to edit the message.");
            }

        })
    }
}

exports.Comment = Comment;