"use client"

import {NftType} from "@/domain/types"
import {DateTime} from "luxon"
import {DotsHorizontalIcon} from "@radix-ui/react-icons"
import React, {useEffect, useRef, useState} from "react"
import {MintFilledIcon, MintIcon} from "@/components/ui/icons"
import {MessageCircle, MoveUp, SendIcon, X} from "lucide-react"
import ClampLines from "react-clamp-lines"
import {
  useGetPaginatedComments,
  useGetPaginatedReplyComments,
  useMintComment,
  useMintNft,
  useUnmintComment,
  useUnmintNft
} from "@/repository/hooks"
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer"
import {Separator} from "@/components/ui/separator"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {ScrollArea} from "@/components/ui/scroll-area"
import {PaginatedCommentElement, type PaginatedCommentsResponse} from "@/http/rest/types"
import {commentNftSize} from "@/services/constants"
import Link from "next/link"
import {Badge} from "@/components/ui/badge"

function ReplyCommentRow(props: CommentRowProps) {
  const [mint, setMint] = useState(props.minted)
  const {mintComment, isFetchingMint} = useMintComment(props.commentId)
  const {unmintComment, isFetchingUnmint} = useUnmintComment(props.commentId)
  const [mintCommentCount, setMintCommentCount] = useState(props.mintCommentCount)
  const handleMintClick = async () => {
    if (!isFetchingMint && !isFetchingUnmint) {
      if (mint) {
        const result = await unmintComment()

        if (result === "unminted") {
          setMint(false)
          setMintCommentCount(prevState => prevState - 1)
        }
      } else {
        const result = await mintComment()

        if (result === "minted") {
          setMint(true)
          setMintCommentCount(prevState => prevState + 1)
        }
      }
    }
  }

  return (
    <div className="max-w-screen-md flex pl-16 pr-5 min-h-16 text-sm gap-4 justify-between mt-4">
      <Link href={`/profile/${props.commenterUsername}`} className="h-full grid items-center">
        <div className="size-9">
          <img
            className="rounded-full border-2 size-9"
            crossOrigin="anonymous"
            draggable={false}
            src={props.commenterAvatarUrl}
            alt={`profile avatar of ${props.commenterUsername}`}
          />
        </div>
      </Link>
      <div className="flex-grow mt-1">
        <div>
          <Link
            href={`/profile/${props.commenterUsername}`}
            className="font-semibold">
            {props.commenterUsername}
          </Link>
          <span className="text-gray-500"> · {props.commentedAt.toRelative({style: "short", locale: "en"})}</span>
        </div>

        <div>
          {props.commentary}
        </div>
        <button
          onClick={event => {
            event.preventDefault()
            props.replyComment({
              commentId: props.commentId,
              replyUsername: props.commenterUsername
            })
          }}
          className="justify-self-start text-gray-500 mt-1">
          Reply
        </button>
      </div>
      <div className="grid">
        <button className="mt-3 size-4" onClick={async event => {
          event.preventDefault()
          await handleMintClick()
        }}>
          {
            mint
              ? <MintFilledIcon className="fill-primary"/>
              : <MintIcon className="stroke-black dark:stroke-white"/>
          }
        </button>
        <div className="text-center">
          {mintCommentCount}
        </div>
      </div>
    </div>
  )
}

interface CommentRowProps extends PaginatedCommentElement {
  replyComment: (data: ReplyCommentData) => void
}

function CommentRow(props: CommentRowProps) {
  const [mint, setMint] = useState(props.minted)
  const {mintComment, isFetchingMint} = useMintComment(props.commentId)
  const {unmintComment, isFetchingUnmint} = useUnmintComment(props.commentId)
  const [mintCommentCount, setMintCommentCount] = useState(props.mintCommentCount)
  const [comments, setComments] = useState<PaginatedCommentsResponse>([])
  const [hasMore, setHasMore] = useState(props.replyCount > 0)
  const [page, setPage] = useState(1)
  const [hideThread, setHideThread] = useState(false)
  const {getPaginatedReplyComments, isFetchingReplyComments} = useGetPaginatedReplyComments(props.commentId)
  const handleMintClick = async () => {
    if (!isFetchingMint && !isFetchingUnmint) {
      if (mint) {
        const result = await unmintComment()

        if (result === "unminted") {
          setMint(false)
          setMintCommentCount(prevState => prevState - 1)
        }
      } else {
        const result = await mintComment()

        if (result === "minted") {
          setMint(true)
          setMintCommentCount(prevState => prevState + 1)
        }
      }
    }
  }
  const handleReplyComment = () => {
    props.replyComment({
      commentId: props.commentId,
      replyUsername: props.commenterUsername
    })
  }
  const loadNextPage = async () => {
    if (!hasMore || isFetchingReplyComments) {
      return
    }

    const paginatedComments = await getPaginatedReplyComments(page)

    if (typeof paginatedComments === "string") {
      setHasMore(false)

      return
    }

    if (paginatedComments.length < commentNftSize) {
      setHasMore(false)
    }

    setComments([...comments, ...paginatedComments])
    setPage(page + 1)
  }

  return (
    <>
      <div className="max-w-screen-md flex px-5 min-h-16 text-sm gap-4 justify-between mt-4">
        <Link href={`/profile/${props.commenterUsername}`} className="h-full grid items-center">
          <div className="size-9">
            <img
              className="rounded-full border-2 size-9"
              crossOrigin="anonymous"
              draggable={false}
              src={props.commenterAvatarUrl}
              alt={`profile avatar of ${props.commenterUsername}`}
            />
          </div>
        </Link>
        <div className="flex-grow mt-1">
          <div>
            <Link
              href={`/profile/${props.commenterUsername}`}
              className="font-semibold">
              {props.commenterUsername}
            </Link>
            <span className="text-gray-500"> · {props.commentedAt.toRelative({style: "short", locale: "en"})}</span>
          </div>

          <div>
            {props.commentary}
          </div>
          <button onClick={event => {
            event.preventDefault()
            handleReplyComment()
          }} className="justify-self-start text-gray-500 mt-1">
            Reply
          </button>
        </div>
        <div className="grid">
          <button
            className="mt-3 size-4"
            onClick={async event => {
              event.preventDefault()
              await handleMintClick()
            }}>
            {
              mint
                ? <MintFilledIcon className="fill-primary"/>
                : <MintIcon className="stroke-black dark:stroke-white"/>
            }
          </button>
          <div className="text-center">
            {mintCommentCount}
          </div>
        </div>
      </div>

      {
        !hideThread &&
        comments.map((comment, index) => (
          <ReplyCommentRow
            key={index}
            commentId={comment.commentId}
            commentedAt={comment.commentedAt}
            commenterUsername={comment.commenterUsername}
            commenterAvatarUrl={comment.commenterAvatarUrl}
            mintCommentCount={comment.mintCommentCount}
            commentary={comment.commentary}
            minted={comment.minted}
            replyCount={comment.replyCount}
            replyComment={props.replyComment}
          />
        ))
      }

      {
        props.replyCount > 0 && hasMore && !hideThread
        && <div className="flex items-center mt-2 pl-16">
          <Separator className="w-8"/>
          <button
            disabled={isFetchingReplyComments}
            className="ml-4 text-gray-500 text-sm"
            onClick={async event => {
              event.preventDefault()
              await loadNextPage()
            }}
          >
            See {props.replyCount - comments.length} other answer
          </button>
        </div>
      }

      {
        props.replyCount > 0 && !hasMore && !hideThread
        && <div className="flex items-center mt-2 pl-16">
          <Separator className="w-8"/>
          <button
            onClick={event => {
              event.preventDefault()
              setHideThread(true)
            }}
            className="ml-4 text-gray-500 text-sm">
            Hide answers
          </button>
        </div>
      }

      {
        props.replyCount > 0 && !hasMore && hideThread
        && <div className="flex items-center mt-2 pl-16">
          <Separator className="w-8"/>
          <button
            onClick={event => {
              event.preventDefault()
              setHideThread(false)
            }}
            className="ml-4 text-gray-500 text-sm">
            See {props.replyCount} answers
          </button>
        </div>
      }
    </>
  )
}

interface ReplyCommentData {
  commentId: number,
  replyUsername: string
}

type CommentState = "open" | "close"

interface ThreadElementProps {
  nftId: number,
  username: string,
  avatarUrl: string,
  contentUrl: string,
  type: NftType,
  postedAt: DateTime<true>,
  isMinted: boolean,
  comments: number,
  mints: number,
  description: string
}

export function ThreadElement(props: ThreadElementProps) {
  const [minted, setMinted] = useState(props.isMinted)
  const [mints, setMints] = useState(props.mints)
  const [commentState, setCommentState] = useState<CommentState>("close")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(props.comments > 0)
  const [replyCommentData, setReplyCommentData] = useState<null | ReplyCommentData>(null)
  const [rootComments, setRootComments] = useState<PaginatedCommentsResponse>([])
  const commentAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const {mintNft, isFetchingMint} = useMintNft(props.nftId)
  const {unmintNft, isFetchingUnmint} = useUnmintNft(props.nftId)
  const {getPaginatedComments, isFetchingComments} = useGetPaginatedComments(props.nftId)
  const handleMintClick = async () => {
    if (!isFetchingMint && !isFetchingUnmint) {
      if (minted) {
        const result = await unmintNft()

        if (result === "unminted") {
          setMinted(false)
          setMints(prevState => prevState - 1)
        }
      } else {
        const result = await mintNft()

        if (result === "minted") {
          setMinted(true)
          setMints(prevState => prevState + 1)
        }
      }
    }
  }
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setCommentState("open")
    } else {
      setCommentState("close")
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadNextPage = async () => {
    if (!hasMore || isFetchingComments) {
      return
    }

    const paginatedNfts = await getPaginatedComments(page)

    if (typeof paginatedNfts === "string") {
      setHasMore(false)

      return
    }

    if (paginatedNfts.length < commentNftSize) {
      setHasMore(false)
    }

    setRootComments([...rootComments, ...paginatedNfts])
    setPage(page + 1)
  }
  const replyComment = (data: ReplyCommentData | null) => {
    setReplyCommentData(data)

    if (commentAreaRef.current) {
      commentAreaRef.current.focus()
    }
  }
  const handleCloseReplyBadge = () => {
    setReplyCommentData(null)
  }
  const handleSendCommentClick = () => {
    // eslint-disable-next-line no-empty
    if (commentAreaRef.current && commentAreaRef.current.value) {
    }
  }

  useEffect(() => {
    if (commentState === "open" && page === 1) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      setTimeout(async () => {
        await loadNextPage()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentState, page])

  return (
    <section className="h-15 max-w-[470px]">
      <Drawer onOpenChange={handleOpenChange}>
        <div className="flex justify-between px-4 py-3.5 sm:px-0 items-center">
          <Link className="flex items-center gap-3" href={`/profile/${props.username}`}>
            <div className="size-9">
              <img
                className="rounded-full border-2 absolute size-9"
                crossOrigin="anonymous"
                draggable={false}
                src={props.avatarUrl}
                alt={`profile avatar of ${props.username}`}
              />
            </div>
            <div className="text-sm font-medium">{props.username}</div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-gray-500 text-sm">
              {props.postedAt.toRelative({style: "short", locale: "en"})}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="size-5">
                  <DotsHorizontalIcon className="size-5"/>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <img
          crossOrigin="anonymous"
          draggable={false}
          src={props.contentUrl}
          alt={`content of ${props.username}`}
        />
        <div className="h-11 flex items-center justify-between px-4 sm:px-0">
          <div className="h-6 flex items-center gap-4">
            <button onClick={async (event) => {
              event.preventDefault()
              await handleMintClick()
            }} className="size-6">
              {
                minted
                  ? <MintFilledIcon className="fill-primary"/>
                  : <MintIcon className="stroke-black dark:stroke-white"/>
              }
            </button>
            <DrawerTrigger onClick={() => {
              setTimeout(() => {
                replyComment(null)
              }, 200)
            }} asChild>
              <button className="size-6">
                <MessageCircle/>
              </button>
            </DrawerTrigger>
          </div>
          <button className="size-6">
            <SendIcon/>
          </button>
        </div>
        <div className="text-sm font-medium px-4 sm:px-0">
          {mints} mints
        </div>
        <div className="px-4 sm:px-0 text-sm">
          <ClampLines
            text={props.description}
            id={String(Math.random())}
            lines={1}
            ellipsis="..."
            moreText="more"
            lessText="less"/>
        </div>
        <DrawerTrigger asChild>
          <button className="px-4 sm:px-0 text-sm text-gray-500">
            {
              props.comments > 0
                ? `See the ${props.comments} comments`
                : "No comments"
            }
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="h-[75vh] mx-auto w-full max-w-screen-md flex flex-col justify-center items-center gap-2 pt-4">
            <div className="font-medium">Commentaries</div>
            <Separator/>
            <ScrollArea>
              {
                rootComments.map((comment, index) => (
                  <CommentRow
                    key={index}
                    commentId={comment.commentId}
                    commentedAt={comment.commentedAt}
                    commenterUsername={comment.commenterUsername}
                    commenterAvatarUrl={comment.commenterAvatarUrl}
                    mintCommentCount={comment.mintCommentCount}
                    commentary={comment.commentary}
                    minted={comment.minted}
                    replyCount={comment.replyCount}
                    replyComment={replyComment}
                  />
                ))
              }

              {
                hasMore
                && <button
                  onClick={async (event) => {
                    event.preventDefault()
                    await loadNextPage()
                  }}
                  disabled={isFetchingComments}
                  className="text-sm px-5 text-gray-500">
                  See {props.comments - rootComments.length} other answer
                </button>
              }
            </ScrollArea>
            <form className="flex gap-2 mb-2 items-center min-w-full px-4">
              {
                replyCommentData &&
                <Badge className="absolute -mt-24">
                  reply at
                  {" "}
                  @{replyCommentData.replyUsername}
                  <button onClick={event => {
                    event.preventDefault()
                    handleCloseReplyBadge()
                  }} className="ml-2"><X className="size-4"></X></button>
                </Badge>
              }
              <Textarea
                ref={commentAreaRef}
                className="flex-grow resize-none rounded-2xl"
                placeholder="Enter your comment"/>
              <Button
                variant="default"
                type="submit"
                className="h-full rounded-2xl"
                onClick={event => {
                  event.preventDefault()
                  handleSendCommentClick()
                }}
              >
                <MoveUp/>
              </Button>
            </form>

          </div>
        </DrawerContent>
      </Drawer>
    </section>
  )
}
