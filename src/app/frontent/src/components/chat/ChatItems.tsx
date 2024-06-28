import { Avatar, Box, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function extractCodeFromString(message: string) {
  if (message.includes("```")) {
    const blocks = message.split("```");
    return blocks;
  }
}

function isCodeBlock(str: string) {
  if (
    str.includes("=") ||
    str.includes(";") ||
    str.includes("[") ||
    str.includes("]") ||
    str.includes("{") ||
    str.includes("}") ||
    str.includes("#") ||
    str.includes("//")
  ) {
    return true;
  }
  return false;
}
const ChatItems = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = useAuth();
  return role === "assistant" ? (
    <Box sx={{ display: "flex", p: 2, bgcolor: "#004d561", my: 2, gap: 2 }}>
      <Avatar sx={{ ml: "0" }}>
        <img src="openai.png" alt="open ai pic" width={"30px"} />
      </Avatar>
      <Box>
        {/* <Typography fontSize={"20px"}>{content}</Typography> */}

        {!messageBlocks && (
          <Typography sx={{ fontSize: "20px" }}>{content}</Typography>
        )}
        {messageBlocks &&
          messageBlocks.length &&
          messageBlocks.map((block) =>
            isCodeBlock(block) ? (
              <SyntaxHighlighter style={coldarkDark} language="javascript">
                {block}
              </SyntaxHighlighter>
            ) : (
              <Typography sx={{ fontSize: "20px" }}>{block}</Typography>
            )
          )}
      </Box>
    </Box>
  ) : (
    <Box
      sx={{ display: "flex", p: 2, bgcolor: "#0b0c0c", color: "white", gap: 2 }}
    >
      <Avatar sx={{ ml: "0" }}>
        {auth?.user?.name[0]} {auth?.user?.name.split("")[1][0]}
      </Avatar>
      {/* <Box>
        <Typography fontSize={"20px"}>{content}</Typography>
      </Box> */}

      <Box>
        {/* <Typography fontSize={"20px"}>{content}</Typography> */}

        {!messageBlocks && (
          <Typography sx={{ fontSize: "20px" }}>{content}</Typography>
        )}
        {messageBlocks &&
          messageBlocks.length &&
          messageBlocks.map((block) =>
            isCodeBlock(block) ? (
              <SyntaxHighlighter style={coldarkDark} language="javascript">
                {block}
              </SyntaxHighlighter>
            ) : (
              <Typography sx={{ fontSize: "20px" }}>{block}</Typography>
            )
          )}
      </Box>
    </Box>
  );
};

export default ChatItems;
