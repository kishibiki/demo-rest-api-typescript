import * as mongoose from 'mongoose';

interface ICounter extends Document {
    key: string;
    sequence_no: number;
}

const counterSchema = new mongoose.Schema<ICounter>({
    key: { 
        type: String,
        required: true,
    },
    sequence_no: {
        type: Number,
        default: 1
    }   
});

export const modelCounter = mongoose.model<ICounter>('counter', counterSchema);

interface IAuthor extends Document {
    author_id?: number;
    name: string;
    gender?: number;
}

const authorSchema = new mongoose.Schema<IAuthor>({
    author_id: {
        type: Number,
        default: 1
    },	    
    name: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: Number,
        default: 1
    },
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

authorSchema.pre<IAuthor>('save', async function(next: (err?: any) => void){
    const doc = this as IAuthor;   
    try {
	const seq = await modelCounter.findOneAndUpdate (
	    { key : 'author' },
	    { $inc : { sequence_no : 1 } },
	    { new : true }
        ).exec();
        if (!seq) return next(new Error('Sequence not found'));
        doc.author_id = seq.sequence_no;
	return next();
    } catch (err) {
	next(err);
    }
});

//module.exports = mongoose.model('author', authorSchema, 'authors');
export const modelAuthor = mongoose.model<IAuthor>('author', authorSchema);

interface IPublisher extends Document {
    publisher_id?: number;
    name: string;
}

const publisherSchema = new mongoose.Schema<IPublisher>({
    publisher_id: {
        type: Number,
        default: 1
    },	    
    name: {
        type: String,
        required: true,
        unique: true
    }
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

publisherSchema.pre<IPublisher>('save', async function(next: (err?: any) => void) {
    const doc = this as IPublisher;   
    try {
	const seq = await modelCounter.findOneAndUpdate (
	    { key : 'publisher' },
	    { $inc : { sequence_no : 1 } },
	    { new : true }
        ).exec();
        if (!seq) return next(new Error('Sequence not found'));
        doc.publisher_id = seq.sequence_no;
	return next();
    } catch (err) {
	next(err);
    }
});

/*
publisherSchema.pre('save', function(this: publisherSchema, next){
    const doc = this;
    modelCounter.findOneAndUpdate (
	{ key : 'publisher' },
	{ $inc : { sequence_no : 1 } },
	{ new : true },  
	function(err, seq: modelCounter){
	　　　　　　　if(err) return next(err);
	　　　　　　　doc.publisher_id = seq.sequence_no;
	　　　　　　　next();
        });
});
*/
//module.exports = mongoose.model('publisher', publisherSchema, 'publishers');
export const modelPublisher = mongoose.model('publisher', publisherSchema);
/*
const modelNestpublisher = mongoose.model('publisher', new mongoose.Schema<IPublisher>({
	name: { type: String }
})
);
*/

export interface IBook extends Document {
    book_id: number;
    title: string;
    publisher?: IPublisher | number |string | undefined;
    authors? : (number | string)[];
    introduction? : string;
    read: boolean;
}

const bookSchema = new mongoose.Schema<IBook>({
  book_id: {
    type: Number,
    default: 1
  },	    
  title: {
    type: String,
    required: true,
    unique: true
  },
  authors: {
    type: [Number],
    default: [] 
  },
  publisher: {
    type: Number
    //ref: 'modelNestpublisher'
  　},
  introduction: {
    type: String
  },
  /*
  author: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  */
  read: {
    type: Boolean,
    default: false,
    required: true
  }
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

bookSchema.pre<IBook>('save', async function(next: (err?: any) => void) {
    const doc = this as IBook;
    try {
	const seq = await modelCounter.findOneAndUpdate (
	    { key : 'book' },
	    { $inc : { sequence_no : 1 } },
	    { new : true }
        ).exec();
        if (!seq) return next(new Error('Sequence not found'));
        doc.book_id = seq.sequence_no;
	return next();
    } catch (err) {
	next(err);
    }
});

/*
bookSchema.pre('save', function(this: bookSchema, next){
    const doc = this;
    modelCounter.findOneAndUpdate (
	{ key : 'book' },
	{ $inc : { sequence_no : 1 } },
	{ new : true },  
	function(err, seq: modelCounter){
	　　　　　　　if(err) return next(err);
	　　　　　　　doc.book_id = seq.sequence_no;
	　　　　　　　next();
        });
});
*/
// Export model
//module.exports = mongoose.model('book', bookSchema, 'books');
export const modelBook = mongoose.model<IBook>('book', bookSchema);
