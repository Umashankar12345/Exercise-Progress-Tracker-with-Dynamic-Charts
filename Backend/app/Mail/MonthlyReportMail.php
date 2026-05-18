<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class MonthlyReportMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $pdfPath;
    public $userName;

    /**
     * Create a new message instance.
     */
    public function __construct(string $pdfPath, string $userName)
    {
        $this->pdfPath = $pdfPath;
        $this->userName = $userName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your FitTrack AI Monthly Performance Report',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.monthly-report',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        if ($this->pdfPath && file_exists($this->pdfPath)) {
            return [
                Attachment::fromPath($this->pdfPath)
                    ->as('Monthly-Performance-Report.pdf')
                    ->withMime('application/pdf'),
            ];
        }

        return [];
    }
}
