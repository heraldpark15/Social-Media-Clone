import {
    Button,
    Flex,
    Heading,
    Input,
    Stack,
    Center,
  } from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import { Field } from '../../components/Misc/field'
import { Avatar } from '../../components/Misc/avatar'
import { DialogBody, DialogCloseTrigger,
    DialogActionTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger, } from "../../components/Misc/dialog"
import useAuthStore from "../../store/authStore"
import { useRef, useState } from 'react'
import usePreviewImg from '../../hooks/usePreviewImg'
import useEditProfile from '../../hooks/useEditProfile'
import useShowToast from '../../hooks/useShowToast'

const EditProfile = () => {
    const [inputs,setInputs] = useState({
        fullName: '', 
        username: '',
        bio: ''
    })
    const authUser = useAuthStore((state) => state.user)
    const fileRef = useRef(null)
    const showToast = useShowToast
    const { handleImageChange, selectedFile, setSelectedFile } = usePreviewImg()
    const { isUpdating, editProfile } = useEditProfile()
    const handleEditProfile = async() => {
        try {
            await editProfile(inputs, selectedFile)
            setSelectedFile(null)
        } catch (error) {
            showToast("Error", error.message, "error")
        }
    }
    return (
      <DialogRoot>
        <DialogTrigger asChild>
          <Button variant="outline" background={"white"} color={"black"} _hover={{bg:"whiteAlpha.800"}} size={{base:"xs",md:"sm"}}>
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent>
            <Flex bg={'black'}>
                <Stack
                    spacing={4}
                    w={'full'}
                    maxW={'md'}
                    bg={'black'}
                    p={6}
                    my={0}>
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        Edit Profile
                    </Heading>
                    <Stack direction={['column', 'row']} spacing={6}>
                        <Center>
                            <Avatar size="xl" src={selectedFile || authUser.profilePicURL} border={"2px solid white"} />
                        </Center>
                        <Center w="full">
                            <Button w="full" onClick={() => fileRef.current.click()}>Edit Profile Picture</Button>
                        </Center>
                        <Input type='file' hidden ref={fileRef} onChange={handleImageChange}/>
                    </Stack>
                    <Field label="Full Name">
                        <Input placeholder={"Full Name"} size={"sm"} type="text"
                            value={inputs.fullName || authUser.fullName}
                            onChange={(e) => setInputs({...inputs, fullName: e.target.value})}
                        />
                    </Field>
                    <Field label="Username">
                        <Input placeholder={"Username"} size={"sm"} type="text"
                            value={inputs.username || authUser.username}
                            onChange={(e) => setInputs({...inputs, username: e.target.value})}
                        />
                    </Field>
                    <Field label="Bio">
                        <Input placeholder={"Bio"} size={"sm"} type="text"
                            value={inputs.bio || authUser.bio}
                            onChange={(e) => setInputs({...inputs, bio: e.target.value})}
                        />
                    </Field>
                    <Flex w="full" gap={4}>
                        {/* Cancel Button */}
                        <DialogActionTrigger asChild flex={1}>
                            <Button
                            bg={'red.400'}
                            color={'white'}
                            flex={1} 
                            _hover={{ bg: 'red.500' }}>
                            Cancel
                            </Button>
                        </DialogActionTrigger>

                        {/* Submit Button */}
                        <DialogActionTrigger asChild flex={1}>
                            <Button
                            bg={'blue.400'}
                            color={'white'}
                            flex={1} 
                            _hover={{ bg: 'blue.500' }}
                            onClick={handleEditProfile}
                            isLoading={isUpdating}>
                            Submit
                            </Button>
                        </DialogActionTrigger>
                        </Flex>
                </Stack>
            </Flex>
        </DialogContent>
      </DialogRoot>
    )
  }

export default EditProfile