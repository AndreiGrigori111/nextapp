"use client";


import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/navbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Editor } from 'primereact/editor';
import InputText  from '../../components/inputText';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import {Book} from '../app/Models/Book'
import axios from 'axios';
import { cwd } from 'process';


export default function Home() {
 
  
let newBook : Book = {
    id: null,
    name: '',
    author: '',
    isRead: false,
    createdAt: null
  };
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editedRow, setEditedRow] = useState(null);

  const [book, setBook] = useState<Book>(newBook);
  const toast = useRef<Toast>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [deleteBookDialog, setDeleteBookDialog] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  


  
  const statusBodyTemplate = (rowData: Book) => {
    return <span>{rowData.isRead ? 'Read' : 'Unread'}</span>;
  };


  

 const actionBodyTemplate = (rowData: Book) => {
    return (
        <React.Fragment>
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteBook(rowData)} />
        </React.Fragment>
    );
  };
  const leftToolbarTemplate = () => {
    return (
        <div className="flex flex-wrap gap-2">
            <Button label="New" icon="pi pi-plus" severity="success" onClick={showDialog} />
        </div>
    );
  };
  const confirmDeleteBook = (book: Book) => {
    setBook(book);
    setDeleteBookDialog(true);
  };
  const showDialog = () => {
    setBook(newBook);
    setSubmitted(false);
    setDisplayDialog(true);
  };
  const hideDialog = () => {
    setDisplayDialog(false);
  };
    const hideDeleteBookDialog = () => {
    setDeleteBookDialog(false);
  };
  
  
 const saveBook = () => {
  setSubmitted(true);
  setLoading(true);

  if (!book.name) {
    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Book name is required.', life: 3000 });
    setLoading(false);
    return;
  }

  axios.post('/api/books', {
    name: book.name,
    author: book.author,
    createdAt: book.createdAt,
    isRead: book.isRead,
  })
    .then((response) => {
      const createdBook = response.data;
      setBooks([...books, createdBook]);

      // Fetch updated books
      axios.get('/api/books')
        .then((response) => {
          const data = response.data;
          setBooks(data);
          setLoading(false);

          if (data.message) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
          }
        });

      hideDialog();

      if (createdBook.id) {
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Book created: ' + createdBook.name, life: 3000 });
      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: createdBook.message, life: 3000 });
      }
    })
    .catch((error) => {
      console.error('Error creating book:', error);
      setLoading(false);
    });
};
  const deleteBook = () => {
  setLoading(true);
  let status = 200;

  // Send DELETE request using Axios
  axios.delete('/api/books', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: { id: book.id
               }, // Axios uses the 'data' property for the request body in DELETE requests
  })
    .then((response) => {
      status = response.status;
      return response.data;
    })
    .then((deletedBook) => {
      // Update the books state by filtering out the deleted book
      setBooks(books.filter((b) => b.id !== deletedBook.id));

      // Fetch updated list of books
      axios.get('/api/books')
        .then((response) => {
          status = response.status;
          return response.data;
        })
        .then((data) => {
          setBooks(data);
          setLoading(false);

          if (data.message) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
          }
        });

      hideDeleteBookDialog();

      if (status !== 200) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: deletedBook.name, life: 3000 });
      } else {
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: deletedBook.name, life: 3000 });
      }
    })
    .catch((error) => {
      console.error('Error deleting book:', error);
      setLoading(false);
    });
};
  const handleEdit = (id, field, value) => {
     const updatedRow = { ...editedRow, id, [field]: value };
    
    setEditedRow(updatedRow);
    
  };

  const textEditor = (options) => {
  const { rowData, field } = options;
  console.log(options)
   
 console.log(field +" field")
  return (
    
      <InputText
        text={editedRow[field]}
        handleEdit={handleEdit}
        id ={rowData[field].id}
        field= {field}
      />
    );
  
};

// ... Your existing code
const onRowEditInit = (event) => { 
  console.log(event)
  setEditedRow(books[event.index])
} 
const statusEditor = (options) => {
  const { rowData, field } = options;

  return (
    <select
      value={editedRow[field] ? 'Read' : 'Unread'}
      onChange={(e) => {
        const newValue = e.target.value === 'Read';
        handleEdit(rowData.id, field, newValue);
      }}
    >
      <option value="Read">Read</option>
      <option value="Unread">Unread</option>
    </select>
  );
};
const onRowEditComplete = async (event) => {
  try {
    const index = event.index;
    const updatedBook = books[index];
    const updatedBooks = [...books];

    setLoading(true);

    // Send a PUT request using Axios
    const response = await axios.put(`/api/books`, {
      id: updatedBook.id,
      name: editedRow.name,
      author: editedRow.author,
      isRead: editedRow.isRead,
    });

    // Assuming the response contains the updated book data
    const updatedBookData = response.data;

    // Update the state with the modified book at the specified index
    updatedBooks[index] = updatedBookData;
    setBooks(updatedBooks);

    setLoading(false);

    // Optional: Display a success toast
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: `Book updated: ${updatedBookData.name}`,
      life: 3000,
    });
  } catch (error) {
    console.error('Error updating book:', error);

    setLoading(false);

    // Optional: Display an error toast
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update book',
      life: 3000,
    });
  }
};
  const bookDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" onClick={saveBook} />
    </React.Fragment>
  );
  const deleteBookDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteBookDialog} />
        <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteBook} />
    </React.Fragment>
  );
  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _book = { ...book };

    // @ts-ignore
    _book[`${name}`] = val;

    setBook(_book);
  };
   
  return (
    <>
    <Navbar/>
      <h1>forsen</h1>
      {/* ... Other components */}
      <div className="m-3">
        <div className="row">
          <div className="flex-auto w-full">
            <h1>Books</h1>
            <div className="card">
              {loading ? (
                <div className="p-d-flex p-jc-center p-ai-center">
                  <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" />
                </div>
              ) : (
                <div>
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable
                  value={books}
                  editMode="row"
                  dataKey="id"
                  paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} 
                  onRowEditComplete={onRowEditComplete}
                  onRowEditInit={onRowEditInit}
                  tableStyle={{ minWidth: '50rem' }}
                >
                  <Column field="name" header="Name" sortable editor={(options) => textEditor(options)} style={{ width: '20%' }} />
                  <Column field="author" header="Author" sortable  editor={(options) => textEditor(options)} style={{ width: '20%' }} />
                  <Column field="isRead" header="Status" sortable  body={statusBodyTemplate} editor={(options) => statusEditor(options)} style={{ width: '20%' }} />
                  
                   <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                   <Column body={actionBodyTemplate} exportable={false} header="Actions"></Column>
                </DataTable>
                </div>
              )}
              <div>
                <Dialog visible={displayDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Quote Details" modal className="p-fluid" footer={bookDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Book Name 
                    </label>
                    <InputTextarea id="name" value={book.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !book.name })} />
                    {submitted && !book.name && <small className="p-error">Book name required.</small>}
                    <br></br>
                    <label htmlFor="author" className="font-bold">
                       Author of the book
                    </label>
                    <InputTextarea id="author" value={book.author} onChange={(e) => onInputChange(e, 'author')} autoFocus />
                  
                </div>           
            </Dialog>
            <Dialog visible={deleteBookDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteBookDialogFooter} onHide={hideDeleteBookDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {book && (
                        <span>
                            Are you sure you want to delete <b>{book.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
            <Toast ref={toast} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
                    }            