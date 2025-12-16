"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrashIcon } from "@/assets/icons";
import { EyeOutlined } from "@ant-design/icons";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Drawer, Button, Tag, Avatar, Space, Tooltip, message } from "antd";
import { CopyOutlined, PhoneOutlined, MailOutlined, HomeOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Contact } from "@/types/contact";
import { deleteContact } from "@/services/contact.service";

export function ListArticleComponent({
  data,
  onDataChange,
}: {
  data: Contact[];
  onDataChange?: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleViewClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDrawerOpen(true);
  };

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(`${type} copied to clipboard`);
    }).catch(() => {
      message.error(`Failed to copy ${type}`);
    });
  };

  const handleDeleteClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const contactId = selectedContact?._id || selectedContact?.id;
    if (!contactId) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteContact(contactId);
      setIsDialogOpen(false);
      setSelectedContact(null);

      // Refresh the data if callback is provided
      if (onDataChange) {
        onDataChange();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete contact");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          List Contact
        </h2>
        {error && (
          <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
              Name
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Type of Service</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  No contact available
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((contact, index) => (
              <TableRow
                className="text-base font-medium text-dark dark:text-white"
                key={contact._id || `contact-${index}`}
              >
                <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                  <div>{contact.name}</div>
                </TableCell>

                <TableCell>{contact.email}</TableCell>

                <TableCell>{contact.phone}</TableCell>

                <TableCell>{contact.typeOfService}</TableCell>

                <TableCell className="xl:pr-7.5">
                  <div className="flex items-center justify-end gap-x-3.5">
                    <button
                      onClick={() => handleViewClick(contact)}
                      className="hover:text-primary"
                    >
                      <span className="sr-only">View Contact</span>
                      <EyeOutlined />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(contact)}
                      className="hover:text-primary"
                    >
                      <span className="sr-only">Delete Contact</span>
                      <TrashIcon />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Contact"
        description={`Are you sure you want to delete contact from "${selectedContact?.name}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        isLoading={isDeleting}
      />

      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar
              size={48}
              style={{
                backgroundColor: '#1890ff',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              {selectedContact?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </Avatar>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                {selectedContact?.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag color="blue">{selectedContact?.typeOfService}</Tag>
                {selectedContact?.createdAt && (
                  <span style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center' }}>
                    <ClockCircleOutlined style={{ marginRight: '4px' }} />
                    {new Date(selectedContact.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        }
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        size="default"
      >
        {selectedContact && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Contact Information Section */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f0f0f0' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Contact Information
              </h3>

              {/* Email */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#fafafa',
                borderRadius: '8px',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MailOutlined style={{ color: '#666', fontSize: '16px' }} />
                  <span style={{ fontWeight: '500' }}>Email</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#333' }}>{selectedContact.email}</span>
                  <Tooltip title="Copy email">
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => handleCopyToClipboard(selectedContact.email, 'Email')}
                      style={{ color: '#666' }}
                    />
                  </Tooltip>
                </div>
              </div>

              {/* Phone */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#fafafa',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <PhoneOutlined style={{ color: '#666', fontSize: '16px' }} />
                  <span style={{ fontWeight: '500' }}>Phone</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#333' }}>{selectedContact.phone}</span>
                  <Tooltip title="Copy phone">
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => handleCopyToClipboard(selectedContact.phone, 'Phone')}
                      style={{ color: '#666' }}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Company Information Section */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f0f0f0' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Company Information
              </h3>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#fafafa',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <HomeOutlined style={{ color: '#666', fontSize: '16px' }} />
                  <span style={{ fontWeight: '500' }}>Company</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: '#333', marginBottom: '2px' }}>{selectedContact.companyName}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{selectedContact.companyCategory}</div>
                </div>
              </div>
            </div>

            {/* Message Section */}
            <div style={{ flex: 1, marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Message
              </h3>
              <div style={{
                padding: '16px',
                backgroundColor: '#e6f7ff',
                border: '1px solid #91d5ff',
                borderRadius: '8px'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#333',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  margin: 0
                }}>
                  {selectedContact.message || 'No message provided'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              paddingTop: '16px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Space>
                <Button
                  type="primary"
                  danger
                  icon={<TrashIcon />}
                  onClick={() => {
                    handleDeleteClick(selectedContact);
                    setIsDrawerOpen(false);
                  }}
                >
                  Delete
                </Button>
              </Space>
              <Button
                size="large"
                onClick={() => setIsDrawerOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
