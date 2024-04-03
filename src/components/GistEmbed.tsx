import dynamic from "next/dynamic";

const GistEmbed = dynamic(() => import("react-embed-gist"), {
    ssr: false,
});

export default GistEmbed;
