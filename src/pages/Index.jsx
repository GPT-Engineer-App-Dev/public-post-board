import { useState, useEffect } from "react";
import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, Textarea, useDisclosure, VStack } from "@chakra-ui/react";
import { FaHeart, FaTrash, FaUserCircle } from "react-icons/fa";

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loginDetails, setLoginDetails] = useState({ username: "", password: "" });

  useEffect(() => {
    // This would be replaced with an API call to fetch posts
    setPosts([
      { id: 1, title: "First Post", body: "This is the first post", date: new Date(), author: "User1", reactions: { "❤️": 1 } },
      { id: 2, title: "Second Post", body: "This is the second post", date: new Date(), author: "User2", reactions: {} },
    ]);
  }, []);

  const handleLogin = () => {
    // Simulate login
    setUser({ username: loginDetails.username });
    onClose();
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handlePost = () => {
    if (!user) {
      onOpen();
      return;
    }
    const newId = posts.length + 1;
    const updatedPosts = [...posts, { id: newId, title: newPost.title, body: newPost.body, date: new Date(), author: user.username, reactions: {} }];
    setPosts(updatedPosts);
    setNewPost({ title: "", body: "" });
  };

  const handleReaction = (postId, emoji) => {
    if (!user) {
      onOpen();
      return;
    }
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const newReactions = { ...post.reactions };
        newReactions[emoji] = (newReactions[emoji] || 0) + 1;
        return { ...post, reactions: newReactions };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleDeletePost = (postId) => {
    if (!user) {
      onOpen();
      return;
    }
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  return (
    <Container maxW="container.md">
      <Flex justifyContent="space-between" alignItems="center" p={4}>
        <Heading size="md">Public Post Board</Heading>
        <IconButton icon={<FaUserCircle />} onClick={user ? handleLogout : onOpen} aria-label="User Account" />
      </Flex>
      <VStack spacing={4} align="stretch">
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Body</FormLabel>
            <Textarea value={newPost.body} onChange={(e) => setNewPost({ ...newPost, body: e.target.value })} />
          </FormControl>
          <Button mt={4} colorScheme="blue" onClick={handlePost}>
            Post
          </Button>
        </Box>
        {posts
          .sort((a, b) => b.date - a.date)
          .map((post) => (
            <Box key={post.id} p={4} borderWidth="1px" borderRadius="lg">
              <Heading size="md">{post.title}</Heading>
              <Text>{post.body}</Text>
              <Text fontSize="sm">
                By {post.author} on {post.date.toLocaleDateString()}
              </Text>
              <Flex mt={2}>
                <IconButton icon={<FaHeart />} onClick={() => handleReaction(post.id, "❤️")} aria-label="Like" />
                <Text mx={2}>{post.reactions["❤️"] || 0}</Text>
                {user && user.username === post.author && <IconButton icon={<FaTrash />} onClick={() => handleDeletePost(post.id)} aria-label="Delete" />}
              </Flex>
            </Box>
          ))}
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input value={loginDetails.username} onChange={(e) => setLoginDetails({ ...loginDetails, username: e.target.value })} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={loginDetails.password} onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleLogin}>
              Login
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Index;
