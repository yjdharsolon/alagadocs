
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, SendHorizontal, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: Date;
}

export default function RatingsPage() {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [showThankYou, setShowThankYou] = useState(false);
  
  // Mock data for previous reviews
  useEffect(() => {
    // Simulate fetching reviews from an API
    const mockReviews: Review[] = [
      {
        id: '1',
        userId: '123',
        userName: 'Dr. Sarah Johnson',
        rating: 5,
        comment: 'Excellent transcription accuracy. Saved me hours of documentation time.',
        timestamp: new Date(Date.now() - 86400000 * 2) // 2 days ago
      },
      {
        id: '2',
        userId: '456',
        userName: 'Dr. Michael Chen',
        rating: 4,
        comment: 'Very good tool. The AI structuring works well for most of my cases.',
        timestamp: new Date(Date.now() - 86400000 * 5) // 5 days ago
      },
      {
        id: '3',
        userId: '789',
        userName: 'Nurse Patricia Garcia',
        rating: 5,
        comment: 'The app has revolutionized how we handle patient documentation. Highly recommended!',
        timestamp: new Date(Date.now() - 86400000 * 10) // 10 days ago
      }
    ];
    
    setUserReviews(mockReviews);
  }, []);
  
  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to submit review
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new review
      const newReview: Review = {
        id: Date.now().toString(),
        userId: user?.id || 'unknown',
        userName: user?.user_metadata?.full_name || 'Anonymous User',
        rating,
        comment,
        timestamp: new Date()
      };
      
      // Update the reviews list (in a real app, this would be handled by the API)
      setUserReviews([newReview, ...userReviews]);
      
      // Reset form
      setRating(0);
      setComment('');
      
      // Show thank you message
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 3000);
      
      toast.success('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Ratings & Reviews</h1>
            <p className="text-muted-foreground mb-6">
              Help us improve by sharing your experience with AlagaDocs
            </p>
            
            {!showThankYou ? (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Submit Your Feedback</CardTitle>
                  <CardDescription>
                    How was your experience with our transcription service?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((starRating) => (
                        <button
                          key={starRating}
                          type="button"
                          className="p-1"
                          onClick={() => handleRatingClick(starRating)}
                          onMouseEnter={() => setHoveredRating(starRating)}
                          onMouseLeave={() => setHoveredRating(0)}
                        >
                          <Star
                            className={`h-8 w-8 ${
                              (hoveredRating ? starRating <= hoveredRating : starRating <= rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    
                    <div className="text-center text-sm mb-4">
                      {rating === 1 && 'Poor'}
                      {rating === 2 && 'Fair'}
                      {rating === 3 && 'Good'}
                      {rating === 4 && 'Very Good'}
                      {rating === 5 && 'Excellent'}
                    </div>
                    
                    <div>
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us about your experience with AlagaDocs..."
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="flex items-center gap-1"
                      >
                        <SendHorizontal className="h-4 w-4" />
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-8 bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                      <ThumbsUp className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Thank You for Your Feedback!</h3>
                    <p className="text-muted-foreground">
                      Your input helps us improve AlagaDocs for everyone.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>What Others Are Saying</CardTitle>
                <CardDescription>
                  Recent feedback from other healthcare professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userReviews.length > 0 ? (
                    userReviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{review.userName}</h4>
                            <div className="flex items-center mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(review.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm mt-2">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No reviews yet. Be the first to share your experience!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
