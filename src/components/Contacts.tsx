
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ContactUsService from '@/services/contactUsService';
import { ContactForm } from '@/types/contactUs';
import { SpinLoader } from './ui/spin-loader';
import { formatDate } from '@/lib/utils';

const Contacts: React.FC = () => {
  const [contactUsForms, setContactUsForms] = useState<ContactForm[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactForm | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const filteredContacts = contactUsForms.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (contact: ContactForm) => {
    setSelectedContact(contact);
  };

  const fetchContactUsForms = () => {
    setLoading(true);
    ContactUsService.getAll()
      .then((response) => {
        console.log("response= ", response);

        setContactUsForms(response.data);
      })
      .catch((err) => {
        console.log("err = ", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchContactUsForms()
  }, []);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Forms</h1>
        <p className="text-gray-600">Manage contact form submissions</p>
      </div>

      {loading ? (
        <SpinLoader />
      ) : (<Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Contact Forms ({filteredContacts.length})</CardTitle>
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{formatDate(contact.createdAt)}</TableCell>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone || "-"}</TableCell>
                    <TableCell>{contact.subject}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(contact)}
                        >
                          View
                        </Button>
                        {/* <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                      >
                        Delete
                      </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-gray-500 py-6">
                    No contact forms found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>)}

      {selectedContact && (
        <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Contact Form Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Name</h4>
                  <p className="text-gray-600">{selectedContact.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Email</h4>
                  <p className="text-gray-600">{selectedContact.email}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Phone</h4>
                  <p className="text-gray-600">{selectedContact.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Date</h4>
                  <p className="text-gray-600">{selectedContact.createdAt}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Subject</h4>
                <p className="text-gray-600">{selectedContact.subject}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Message</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Contacts;
