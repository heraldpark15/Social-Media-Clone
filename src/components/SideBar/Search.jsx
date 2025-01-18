import { Box, Button, Flex, IconButton, Input } from "@chakra-ui/react";
import { Tooltip } from "../Misc/tooltip";
import { SearchLogo } from "../../assets/constants";
import {
    DialogActionTrigger,
    DialogContent,
    DialogHeader,
    DialogCloseTrigger,
    DialogRoot,
    DialogTrigger,
} from "../../components/Misc/dialog";
import { useRef } from "react";
import useSearchUser from "../../hooks/useSearchUser";
import SuggestedUser from "../SuggestedUsers/SuggestedUser";

const Search = () => {
    const { user, isLoading, getUserProfile, setUser } = useSearchUser();
    const searchRef = useRef(null);

    const handleSearchUser = (e) => {
        e.preventDefault();
        getUserProfile(searchRef.current.value);
    };

    return (
        <>
            <Tooltip
                hasArrow
                label={"Search"}
                placement="right"
                ml={1}
                openDelay={500}
                display={{ base: "block", md: "none" }}
            >
                <DialogRoot motionPreset={"slide-in-left"}>
                    <DialogTrigger asChild>
                        <Flex
                            alignItems={"center"}
                            gap={4}
                            _hover={{ bg: "whiteAlpha.400" }}
                            borderRadius={6}
                            p={2}
                            w={{ base: 10, md: "full" }}
                            justifyContent={{ base: "center", md: "flex-start" }}
                        >
                            <SearchLogo />
                            <Box display={{ base: "none", md: "block" }}>Search</Box>
                        </Flex>
                    </DialogTrigger>
                    <DialogContent
                        bg="gray.900"
                        border="1px solid gray"
                        maxW="360px"
                        p={4}
                        borderRadius="md"
                    >
                        {/* Header with "Search User" and Close Icon */}
                        <DialogHeader>
                            <Flex justify="space-between" align="center">
                                <Box
                                    fontSize="lg"
                                    fontWeight="bold"
                                    textAlign="left"
                                    flex="1"
                                >
                                    Search User
                                </Box>
                                <DialogCloseTrigger/>
                            </Flex>
                        </DialogHeader>

                        {/* Search Input */}
                        <Box mt={6}>
                            <Flex w="full" align="center">
                                <Input
                                    placeholder="Enter username"
                                    ref={searchRef}
                                    size="md"
                                    flex="1"
                                    variant="filled"
                                    borderRadius="md"
                                />
                                <Button
                                    onClick={handleSearchUser}
                                    ml={2}
                                    size="md"
                                    isLoading={isLoading}
                                    colorScheme="blue"
                                    cursor="pointer"
                                >
                                    Search
                                </Button>
                            </Flex>
                        </Box>
                        {user && <SuggestedUser user={user} setUser={setUser}/>}
                    </DialogContent>
                </DialogRoot>
            </Tooltip>
        </>
    );
};

export default Search;
