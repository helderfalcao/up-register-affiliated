'use strict'

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var affiliated = new Schema({
    name: String,
    electionTitle: String,
    electionTitleZone: Number,
    electionTitleSection: Number,
    electionCity: String,
    electionState: String,
    cpf: String,
    rg: String,
    bornDate: Date,
    mothersName: String,
    homeAddress: String,
    homeAddressNumber: String,
    homeAddressAdd: String,
    homeAddressCep: Number,
    homeAddressCity: String,
    homeAddressState: String,
    contactEmail: String,
    contactPhoneFirst: Number,
    contactPhoneSecond: Number,
    contactPhoneWhatsapp: Number,
    contactFacebook: String,
    affiliateDate: Date,
    affiliateResponsible: String,
    affiliatedRecord:  String
}, {
    strict: false
});


module.exports = mongoose.model("Affiliateds", affiliated);