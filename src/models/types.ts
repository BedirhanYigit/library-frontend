// src/types.ts

export interface Book {
    id: number;
    title: string;
    author: string;
    genre?: string;       // The '?' means it is optional (might be null)
    isbn: string;
    numOfTotalCopies: number;
    numOfCopiesAvailable: number;
    available: boolean;
    coverImageUrl?: string;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    role?: string;
  }
  
  export interface Loan {
    id: number;
    bookId: number;
    bookTitle: string;
    userId: number;
    userName: string;
    loanDate: string;
    dueDate: string;
    returnDate: string | null; // Can be a string or null if not returned yet
    returned: boolean;
    author?: string;
    genre?: string;
    isbn?: string;
    book?: Book; // In case the backend nests the book object
  }
  
  export interface Reservation {
    id: number;
    bookId: number;
    bookTitle: string;
    userId: number;
    userName: string;
    reservationDate: string;
    author?: string;
    genre?: string;
    isbn?: string;
    book?: Book;
  }