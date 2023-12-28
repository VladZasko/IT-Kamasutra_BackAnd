const videoQueryRepo = {



    getVideos(): VideoOutputModel[]{
        const dbVideos: DBVideo[] = []
        const authors: DBAuthor[]=[]

        return dbVideos.map(dbVideo => {
            const author = authors.find(a => a._id === dbVideo.authorId)
            return this._mapDBVideoToVideoOutputModel(dbVideo , author!)
        })
    },
    getVideosById(id: string): VideoOutputModel{
        const dbVideo: DBVideo = {
            _id: '2232',
            title: 'sds',
            authorId: '3232',
            banObject: null
        }
        const author: DBAuthor={
            _id: '3232',
            lastName: 'sd',
            firstName: 'sd'
        }

        return this._mapDBVideoToVideoOutputModel(dbVideo, author)
    },
    getBannedVideos(id: string): BanVideoOutputModel[]{
        const dbVideos: DBVideo[] = []
        const authors: DBAuthor[]=[]

        return dbVideos.map(dbVideo => {
            const dbAuthor = authors.find(a => a._id === dbVideo.authorId)
            return {
                id: dbVideo._id,
                title: dbVideo.title,
                author: {
                    id: dbAuthor!._id,
                    name: dbAuthor!.firstName + '' + dbAuthor!.lastName
                },
                banReason: dbVideo.banObject!.banReason
            }
        })
    },
    _mapDBVideoToVideoOutputModel(dbVideo:DBVideo, dbAuthor: DBAuthor) {
        return {
            id: dbVideo._id,
            title: dbVideo.title,
            author: {
                id: dbAuthor!._id,
                name: dbAuthor!.firstName + '' + dbAuthor!.lastName
            }
        }
    }
}

type DBAuthor= {
    _id: string
    firstName: string
    lastName: string
}

type DBVideo = {
    _id: string
    title: string
    authorId: string
    banObject: null | {
        isBanned: boolean
        banReason: string
    }
}
export type VideoOutputModel = {
    id: string
    title: string
    author: {
        id: string
        name: string
    }
}

export type BanVideoOutputModel = VideoOutputModel & {
    id: string
    title: string
    author: {
        id: string
        name: string
    },
    banReason: string
}