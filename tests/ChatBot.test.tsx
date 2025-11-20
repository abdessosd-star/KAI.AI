
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatBot } from '../components/ChatBot';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as geminiService from '../services/geminiService';

// Mock translations
vi.mock('../constants/translations', () => ({
  translations: {
    en: {
      chat: {
        welcome: 'Hello! How can I help you?',
        error: 'Something went wrong.',
        title: 'Career Coach',
        placeholder: 'Type a message...',
      }
    },
    nl: {
        chat: {
            welcome: 'Hallo! Hoe kan ik je helpen?',
            error: 'Er is iets misgegaan.',
            title: 'Carrière Coach',
            placeholder: 'Typ een bericht...',
          }
    }
  }
}));

// Mock geminiService
vi.mock('../services/geminiService', () => ({
  sendChatMessage: vi.fn(),
}));

describe('ChatBot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('renders the chat button initially', () => {
    render(<ChatBot language="en" />);
    // The button has a MessageSquare icon, but we can check if the button exists
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('opens the chat window when clicked', () => {
    render(<ChatBot language="en" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Career Coach')).toBeInTheDocument();
    expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument();
  });

  it('sends a message and displays the response', async () => {
    (geminiService.sendChatMessage as any).mockResolvedValue('I am doing great!');

    render(<ChatBot language="en" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    const input = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getAllByRole('button')[1]; // The second button is the send button inside the chat

    fireEvent.change(input, { target: { value: 'How are you?' } });
    fireEvent.click(sendButton);

    // Check if user message is displayed
    expect(screen.getByText('How are you?')).toBeInTheDocument();

    // Check if response is displayed
    await waitFor(() => {
      expect(screen.getByText('I am doing great!')).toBeInTheDocument();
    });

    expect(geminiService.sendChatMessage).toHaveBeenCalled();
  });

  it('handles errors gracefully', async () => {
    (geminiService.sendChatMessage as any).mockRejectedValue(new Error('API Error'));

    render(<ChatBot language="en" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    const input = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getAllByRole('button')[1];

    fireEvent.change(input, { target: { value: 'Fail please' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });
  });
});
