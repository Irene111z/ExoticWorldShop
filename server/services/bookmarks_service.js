const bookmarks_repository = require('../repositories/bookmarks_repository')

class BookmarksService{
    async getBookmarks(userId){
        return await bookmarks_repository.getBookmarks(userId)
    }
    async addBookmark(userId, postId){
        await bookmarks_repository.addPost(userId, postId)
        return await bookmarks_repository.getBookmarks(userId)
    }
    async removeBookmark(userId, postId){
        await bookmarks_repository.removePost(userId, postId)
        return await bookmarks_repository.getBookmarks(userId)
    }
    async clearBookmarks(userId){
        await bookmarks_repository.clearBookmarks(userId)
        return await bookmarks_repository.getBookmarks(userId)
    }
}

module.exports = new BookmarksService()