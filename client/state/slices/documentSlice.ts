import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Document } from '../api';

interface DocumentState {
  selectedDocument: Document | null;
  userDocuments: Document[];
  clientDocuments: Document[];
  agencyDocuments: Document[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  selectedDocument: null,
  userDocuments: [],
  clientDocuments: [],
  agencyDocuments: [],
  isLoading: false,
  error: null,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setSelectedDocument: (state, action: PayloadAction<Document | null>) => {
      state.selectedDocument = action.payload;
    },
    setUserDocuments: (state, action: PayloadAction<Document[]>) => {
      state.userDocuments = action.payload;
    },
    setClientDocuments: (state, action: PayloadAction<Document[]>) => {
      state.clientDocuments = action.payload;
    },
    setAgencyDocuments: (state, action: PayloadAction<Document[]>) => {
      state.agencyDocuments = action.payload;
    },
    addDocument: (state, action: PayloadAction<Document>) => {
      const document = action.payload;
      if (document.userId) {
        state.userDocuments.push(document);
      }
      if (document.clientId) {
        state.clientDocuments.push(document);
      }
      if (document.agencyId) {
        state.agencyDocuments.push(document);
      }
    },
    removeDocument: (state, action: PayloadAction<string>) => {
      const documentId = action.payload;
      state.userDocuments = state.userDocuments.filter(doc => doc.id !== documentId);
      state.clientDocuments = state.clientDocuments.filter(doc => doc.id !== documentId);
      state.agencyDocuments = state.agencyDocuments.filter(doc => doc.id !== documentId);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearDocumentState: (state) => {
      state.selectedDocument = null;
      state.userDocuments = [];
      state.clientDocuments = [];
      state.agencyDocuments = [];
      state.error = null;
    },
  },
});

export const {
  setSelectedDocument,
  setUserDocuments,
  setClientDocuments,
  setAgencyDocuments,
  addDocument,
  removeDocument,
  setLoading,
  setError,
  clearDocumentState,
} = documentSlice.actions;

export default documentSlice.reducer; 