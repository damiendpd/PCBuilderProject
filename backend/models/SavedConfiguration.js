import mongoose from 'mongoose';

const savedConfigSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  components: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
      required: true
    }
  ]
}, { timestamps: true });

export default mongoose.model('SavedConfiguration', savedConfigSchema);
