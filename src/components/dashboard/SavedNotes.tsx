
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, File, FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface SavedNote {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const SavedNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchSavedNotes();
    }
  }, [user]);

  const fetchSavedNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setNotes(data || []);
    } catch (error: any) {
      console.error('Error fetching notes:', error.message);
      toast.error('Failed to load saved notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      setDeleting(id);
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setNotes(notes.filter(note => note.id !== id));
      toast.success('Note deleted successfully');
    } catch (error: any) {
      console.error('Error deleting note:', error.message);
      toast.error('Failed to delete note');
    } finally {
      setDeleting(null);
    }
  };

  const handleViewNote = (note: SavedNote) => {
    try {
      // Parse the content if it's a JSON string
      const content = typeof note.content === 'string' ? JSON.parse(note.content) : note.content;
      navigate('/structured-output', { 
        state: { 
          structuredData: content,
          fromSaved: true,
          noteId: note.id
        } 
      });
    } catch (error) {
      console.error('Error parsing note content:', error);
      toast.error('Could not open note. Format may be invalid.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-background">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No saved notes yet</h3>
        <p className="text-muted-foreground mb-4">
          Your saved medical notes will appear here.
        </p>
        <Button onClick={() => navigate('/upload')}>
          Create a New Note
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <Card key={note.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="truncate text-lg">{note.title}</CardTitle>
            <CardDescription>
              {new Date(note.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => handleViewNote(note)}
                className="flex items-center gap-2"
              >
                <File className="h-4 w-4" />
                View Note
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteNote(note.id)}
                disabled={deleting === note.id}
              >
                {deleting === note.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SavedNotes;
