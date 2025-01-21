import { Button, Flex, Input, Text } from "@chakra-ui/react";
import {
    DialogContent,
    DialogHeader,
    DialogCloseTrigger,
	DialogBody,
} from "../../components/Misc/dialog";
import usePostComment from "../../hooks/usePostComment";
import { useEffect, useRef, useState } from "react";
import Comment from "../Comment/Comment";

const CommentDialog = ({ post }) => {
    const [comments, setComments] = useState(post.comments || [])
    const { handlePostComment, isCommenting } = usePostComment()
    const commentRef = useRef(null)
    const commentsContainerRef = useRef(null)
    const [comment, setComment] = useState(null)

    const scrollToBottom = () => {
        if (commentsContainerRef.current) {
            commentsContainerRef.scrollTop = commentsContainerRef.current.scrollHeight
        }
    }

    const handleSubmitComment = async() => {
        if (!comment.trim()) {
              showToast("Error", "Comment cannot be blank", "error")
              return
        }
        const success = await handlePostComment(post.id,comment)
        if (success) {
            setComments((prevComments) => [
                ...prevComments,
                { text: comments, id: Date.now() },
            ])
            setComment("")
            scrollToBottom()
        }
    }
    
    useEffect(() => {
        scrollToBottom()
    }, [comments])
    
    return (
            <DialogContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
                <DialogHeader>Comments</DialogHeader>
                <DialogCloseTrigger/>
                <DialogBody pb={6}>
                        <Flex 
                            mb={4} 
                            gap={4} 
                            flexDir={"column"} 
                            maxH={"250px"} 
                            overflowY={"auto"}
                            ref={commentsContainerRef}
                        >
                            {Array.isArray(post.comments) ? (
                                post.comments.map((comment, idx) => (
                                    <Comment key={idx} comment={comment} />
                                ))
                            ) : (
                                    <Text color="gray.500">No comments yet</Text>
                            )}
                        </Flex>
                        <Flex alignItems="center" gap={2}>
                            <Input
                                variant={"flushed"}
                                placeholder={"Add a comment..."}
                                fontSize={14}
                                onChange = {(e) => setComment(e.target.value)}
                                value={comment}
                                ref={commentRef}
                                flex={1}
                            />
                            <Button
                                    fontSize={14}
                                    color={"blue.500"}
                                    fontWeight={600}
                                    cursor={"pointer"}
                                    _hover={{ color: "white" }}
                                    bg={"transparent"}
                                    onClick={handleSubmitComment}
                                    isLoading={isCommenting}
                            >
                                      Post
                            </Button>
                        </Flex>
                </DialogBody>
            </DialogContent>
    )
}

export default CommentDialog