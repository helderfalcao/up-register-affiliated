const express = require('express')
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

// Use mongoose in AdminBro
AdminBro.registerAdapter(AdminBroMongoose);

// Connect to your MongoDB database
mongoose.connect('mongodb+srv://admin:123456@cluster0.pzyiw.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected!'))
  .catch(err => console.log(err));

const app = express();

// Load resources
const Affiliated = require('./model/Affiliated')
const admin = require('./model/Admin')

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
  resources: [{
    resource: Affiliated,
    options: {
      properties: {
        _id: {
          isTitle: true,
          label: "Nome"
        },
        bornDate: {
          type: "date",
          "label": "Data de nascimento"
        },
        name: {
          description: "Descrição nome completo"
        }
      }
    }
  },
  {
    resource: admin,
    options: {
      properties: {
        encryptedPassword: {
          isVisible: false,
        },
        password: {
          type: 'string',
          isVisible: {
            list: false, edit: true, filter: false, show: false,
          },
        },
      },
      actions: {
        new: {
          before: async (request) => {
            if (request.payload.password) {
              request.payload = {
                ...request.payload,
                encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                password: undefined,
              }
            }
            return request
          },
        }
      }
    }
  }],
  locale: {
    language: 'pl',
    translations: {
      labels: {
        Affiliateds: "Afiliados"
      },
      resources: {
        Affiliateds: {
          properties: {
            name: 'Nome completo',
            electionTitle: 'Titulo de eleição',
            electionTitleZone: 'Zona',
            electionTitleSection: 'Seção',
            electionCity: 'Cidade',
            electionState: 'Estado',
            bornDate: 'Data de Nascimento',
            mothersName: 'Nome da mãe',
            homeAddress: 'Endereço',
            homeAddressNumber: 'Nº',
            homeAddressAdd: 'Detalhes endereço',
            homeAddressCep: 'CEP',
            homeAddressCity: 'Cidade',
            homeAddressState: 'Estado',
            contactEmail: 'E-mail de contato',
            contactPhoneFirst: 'Telefone 1',
            contactPhoneSecond: 'Telefone 2',
            contactPhoneWhatsapp: 'Whatsapp',
            contactFacebook: 'Facebook',
            affiliateDate: 'Data filiação',
            affiliateResponsible: 'Responsável filiação',
            affiliatedRecord: 'Ficha filiação'
          }
        }
      }
    }
  }
})

// Build and use a router which will handle all AdminBro routes
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await admin.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword)
      if (matched) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
})
app.use(adminBro.options.rootPath, router);

app.listen(8080, () => console.log('AdminBro is under localhost:8080/admin'));
