import firebase from 'firebase/compat/app';
export interface UserInterface {
    name: string,
    email: string,
    createdAt: any,
    lastLogin: firebase.firestore.Timestamp | string | firebase.firestore.FieldValue,
    photoPath: string,
}
