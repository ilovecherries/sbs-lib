const { exportAllDeclaration } = require('@babel/types');
const { Comment } = require('../src/comment');

const API_ENDPOINT = 'https://newdev.smilebasicsource.com/api/'

test('Get a comment by ID and check if its content matches', () => {
    return Comment.getByID(82268, API_ENDPOINT)
        .then(comment => expect(comment.textContent).toBe('back to here'));
})