const mongoose = require('mongoose');
// _id
// 67d149317e25e666a216422d
// ncRNA Symbol
// "ARHGAP5-AS1"
// ncRNA Category
// "LncRNA"
// Species
// "Homo sapiens"
// Disease Name
// "Carcinoma, Hepatocellular"
// Sample
// "HCC cells and tissues"
// Dysfunction Pattern
// "Epigenetics( m6 A-modified)"
// Validated Method
// "qRT-PCR"
// Description
// "Among these lncRNAs, we found that ARHGAP5-AS1 is the lncRNA with the …"
// Causality
// "Yes"
// Causal Description
// "ARHGAP5-AS1 remarkably promotes malignant behaviours of HCC cells ex v…"
// PubMed ID
// 36354136


const NcRnaSchema = new mongoose.Schema({
  "ncRNA Symbol": { type: String, required: true }, 
  "ncRNA Category": { type: String, required: true }, 
  Species: { type: String, required: true }, 
  "Disease Name": { type: String, required: true }, 
  Sample: { type: String, required: true }, 
  "Dysfunction Pattern" : { type: String, required: true }, 
  "Validated Method" : { type: String, required: true }, 
  Description : { type: String, required: true }, 
  Causality: { type: String, required: true, enum: ["Yes", "No"] }, 
  "Causal Description": { type: String, required: true }, 
  "PubMed ID" : { type: Number, required: true } 
},{collection:"lncrna"} ,{ timestamps: true });

module.exports = mongoose.model('NcRna', NcRnaSchema);
