<?php

namespace App\Http\Controllers;

use App\Models\SocialPost;
use App\Models\Like;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SocialPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();

        $posts = SocialPost::with(['user', 'likes', 'comments.user'])
            ->latest()
            ->get()
            ->map(function ($post) use ($userId) {
                return [
                    'id' => $post->id,
                    'content' => $post->content,
                    'image_url' => $post->image_url,
                    'created_at' => $post->created_at,
                    'user' => [
                        'name' => $post->user ? $post->user->name : 'Anonymous Athlete',
                        'avatar' => $post->user ? $post->user->avatar_url : null,
                    ],
                    'likes_count' => $post->likes->count(),
                    'liked_by_me' => $post->likes->contains('user_id', $userId),
                    'comments_count' => $post->comments->count(),
                    'comments' => $post->comments->map(function ($c) {
                        return [
                            'id' => $c->id,
                            'content' => $c->content,
                            'created_at' => $c->created_at,
                            'user' => [
                                'name' => $c->user ? $c->user->name : 'Anonymous Athlete',
                                'avatar' => $c->user ? $c->user->avatar_url : null,
                            ]
                        ];
                    })
                ];
            });

        return response()->json($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'image_url' => 'nullable|string',
        ]);

        $post = SocialPost::create([
            'user_id' => Auth::id(),
            'content' => $request->content,
            'image_url' => $request->image_url,
        ]);

        return response()->json($post->load('user'));
    }

    /**
     * Toggle like status on a post.
     */
    public function toggleLike($id)
    {
        $userId = Auth::id();
        $post = SocialPost::findOrFail($id);

        $like = Like::where('social_post_id', $post->id)
            ->where('user_id', $userId)
            ->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            Like::create([
                'user_id' => $userId,
                'social_post_id' => $post->id,
            ]);
            $liked = true;
        }

        return response()->json([
            'liked' => $liked,
            'likes_count' => Like::where('social_post_id', $post->id)->count()
        ]);
    }

    /**
     * Store a comment on a post.
     */
    public function storeComment(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $post = SocialPost::findOrFail($id);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'social_post_id' => $post->id,
            'content' => $request->content,
        ]);

        return response()->json($comment->load('user'));
    }
}
