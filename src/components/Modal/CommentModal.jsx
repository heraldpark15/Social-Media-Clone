import { Button, Flex, Input, Text } from "@chakra-ui/react";
import {
    DialogContent,
    DialogHeader,
    DialogCloseTrigger,
	DialogBody,
} from "../../components/Misc/dialog";
import { Field } from "../Misc/field";
import usePostComment from "../../hooks/usePostComment";
import { useEffect, useRef, useState } from "react";
import Comment from "../Comment/Comment";

const CommentDialog = ({ post }) => {
    const [comments, setComments] = useState(post.comments || [])
    const { handlePostComment, isCommenting } = usePostComment()
    const commentRef = useRef(null)
    const commentsContainerRef = useRef(null)
    
    const handleSubmitComment = async(e) => {
        e.preventDefault()
        const comment = commentRef.current.value.trim()
        if (!comment) return
        
        const success = await handlePostComment(post.id, comment)
        if (success) {
            setComments([...comments, { text: comment, id: Date.now()}])
            commentRef.current.value = ""
        }
    }

    useEffect(() => {
        if (commentsContainerRef.current) {
            commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight
        }
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
                        <Field onSubmit={handleSubmitComment} style={{ marginTop: "2rem" }}>
                            <Input placeholder="Comment" size={"sm"} ref={commentRef} />
                            <Flex w={"full"} justifyContent={"flex-end"}>
                                <Button type="submit" ml={"auto"} size={"sm"} my={4} isLoading={isCommenting}>
                                    Post
                                </Button>
                            </Flex>
                        </Field>
                </DialogBody>
            </DialogContent>
    )
}

export default CommentDialog