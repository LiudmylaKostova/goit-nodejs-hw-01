const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const shortid = require("shortid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

// const listContacts = async () => {
//   try {
//     const data = await fsp.readFile(contactsPath);
//     const content = JSON.parse(data);

//     if (content.length === 0) {
//       return console.log(`There are no contacts`);
//     }
//     console.table(content);
//   } catch (error) {
//     console.log(error);
//   }
// };

function listContacts() {
  fsp
    .readFile(contactsPath, "utf-8")
    .then((data) => {
      const content = JSON.parse(data);
      console.table(content);
    })
    .catch((error) => console.error(error));
}

async function getContactById(contactId) {
  const data = await fsp.readFile(contactsPath);
  const gotData = await JSON.parse(data).find(
    (contact) => contact.id === contactId
  );
  if (gotData) {
    console.log("We found:");
    console.table(gotData);
  } else {
    console.log(`Contact with ID=${contactId} doesn't excist!`);
  }
}

function removeContact(contactId) {
  fsp
    .readFile(contactsPath)
    .then((data) => {
      const updatedContacts = JSON.parse(data).filter(
        (contact) => contact.id !== contactId
      );
      fsp.writeFile(contactsPath, JSON.stringify(updatedContacts));

      console.log("Updated contacts:");
      console.table(updatedContacts);
    })
    .catch((error) => console.error(error));
}

async function addContact(name, email, phone) {
  const data = await fsp.readFile(contactsPath);
  const arr = await JSON.parse(data);
  const id = shortid.generate();
  const newContact = { id, name, email, phone };
  const allContacts = [...JSON.parse(data), newContact];
  await fsp.writeFile(contactsPath, JSON.stringify(allContacts), (error) => {
    if (error) {
      console.warn(error);
    }
  });
  const newData = await fsp.readFile(contactsPath, "utf8");
  console.table(JSON.parse(newData));
}

module.exports = { listContacts, getContactById, removeContact, addContact };
