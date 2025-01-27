import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Card,
  Typography,
  Input,
  Drawer,
  Divider,
  Row,
  Col,
  Spin,
  AutoComplete,
} from "antd";
import {
  MenuOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Document, Page } from "react-pdf";
import axios from "axios";
import { pdfjs } from "react-pdf";
import { Folder, File } from "lucide-react"; // Import icons from lucide-react

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const { Header, Content, Sider, Footer } = Layout;
const { Search } = Input;

const ProductCatalog2 = () => {
  const [folderStructure, setFolderStructure] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pdfScale, setPdfScale] = useState(1.0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);

  const fetchFolderStructure = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/folders/folder-structure"
      );
      setFolderStructure(response.data);
    } catch (error) {
      console.error("Error fetching folder structure:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolderStructure();
  }, []);

  const getRelativePath = (absolutePath) => {
    const prefix =
      "C:\\Users\\coop\\Desktop\\Product catalog\\backend\\uploads\\"; // Adjust according to your backend
    return absolutePath.replace(prefix, "").replace(/\\/g, "/");
  };

  const handleFileClick = (filePath) => {
    const relativePath = getRelativePath(filePath);
    const pathParts = relativePath.split("/");
    const fileName = pathParts.pop();
    const folderPath = pathParts.join("/");

    if (folderPath && fileName) {
      const pdfUrl = `http://localhost:5000/api/files/view-pdf?folderPath=${encodeURIComponent(
        folderPath
      )}&fileName=${encodeURIComponent(fileName)}`;
      setSelectedPdf(pdfUrl);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value) {
      const files = searchFiles(value);
      setFilteredFiles(files);
    } else {
      setFilteredFiles([]);
    }
  };

  const searchFiles = (query) => {
    const allFiles = getAllFiles(folderStructure);
    return allFiles.filter((file) =>
      file.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getAllFiles = (structure) => {
    let files = [];
    const extractFiles = (folders) => {
      folders.forEach((folder) => {
        if (folder.type === "file") {
          files.push(folder);
        }
        if (folder.children) {
          extractFiles(folder.children);
        }
      });
    };
    extractFiles(structure);
    return files;
  };

  const formatFileName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const renderFolderItems = (items) => {
    return items.map((item) => {
      const formattedName = formatFileName(item.name);

      if (item.type === "folder") {
        return (
          <Menu.SubMenu
            key={item.name}
            title={
              <span>
                <Folder size={20} style={{ marginRight: 8 }} />
                {formattedName}
              </span>
            }
          >
            {item.children && renderFolderItems(item.children)}
          </Menu.SubMenu>
        );
      } else if (item.type === "file") {
        return (
          <Menu.Item key={item.name} onClick={() => handleFileClick(item.path)}>
            <span>
              <File size={18} style={{ marginRight: 10 }} />
              {formattedName}
            </span>
          </Menu.Item>
        );
      }
      return null;
    });
  };

  const drawerContent = (
    <div style={{ padding: "10px" }}>
      <Divider />
      <Search
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        enterButton
        allowClear
        prefix={<SearchOutlined />}
        style={{
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "15px",
        }}
      />
      <Menu mode="inline" style={{ marginTop: "10px" }}>
        {renderFolderItems(
          filteredFiles.length > 0 ? filteredFiles : folderStructure
        )}
      </Menu>
    </div>
  );

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const zoomIn = () => setPdfScale(pdfScale + 0.1);
  const zoomOut = () => setPdfScale(pdfScale - 0.1);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          backgroundColor: "#001529",
          padding: "0 16px",
          boxShadow: "0 2px 8px rgba(205, 207, 208, 0.1)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Button
              onClick={handleDrawerToggle}
              style={{
                fontSize: "1.2rem",
                border: "none",
                color: "#fff",
              }}
              icon={<MenuOutlined />}
              tooltip="Open Drawer"
            />
          </Col>
          <Col>
            <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
              Product Viewer
            </Typography.Title>
          </Col>
        </Row>
      </Header>

      <Layout>
        <Sider
          width={400}
          style={{
            background: "#f4f4f4",
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
          }}
          collapsible
          collapsedWidth={0} // Ensures zero-width when collapsed
          breakpoint="lg"
          trigger={null}
          collapsed={mobileOpen}
        >
          {drawerContent}
        </Sider>

        <Layout
          style={{
            marginLeft: mobileOpen ? 0 : 400, // Keep the margin adjustment
            padding: "16px",
            transition: "margin-left 0.2s ease",
            width: "100%", // Ensure content takes full width
          }}
        >
          <Card
            style={{
              width: "100%", // Adjust to take full width
              maxWidth: mobileOpen ? "100%" : "70%", // Limit width on desktop
              marginLeft: mobileOpen ? 0 : 100,
              borderRadius: "10px",
              maxHeight: "100%",
              padding: "20px",
            }}
          >
            {loading ? (
              <Spin size="medium" />
            ) : !selectedPdf ? (
              <Typography.Text>
                Select a PDF to view from the folder.
              </Typography.Text>
            ) : (
              <>
                <Row justify="space-between" style={{ marginBottom: "10px" }}>
                  <Col>
                    <Button
                      onClick={zoomOut}
                      style={{
                        marginRight: "8px",
                        backgroundColor: "#00adef",
                        color: "#fff",
                        borderRadius: "4px",
                        padding: "6px 12px",
                      }}
                    >
                      <ZoomOutOutlined />
                    </Button>
                    <Button
                      onClick={zoomIn}
                      style={{
                        backgroundColor: "#00adef",
                        color: "#fff",
                        borderRadius: "4px",
                        padding: "6px 12px",
                      }}
                    >
                      <ZoomInOutlined />
                    </Button>
                  </Col>
                </Row>
                <Document
                  file={selectedPdf}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={<Typography>Loading PDF...</Typography>}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      scale={pdfScale}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    />
                  ))}
                </Document>
              </>
            )}
          </Card>

          <Footer
            style={{
              textAlign: "center",
              padding: "20px",
              background: "#f4f4f4",
              marginTop: "16px",
              borderTop: "1px solid #e8e8e8",
            }}
          >
            Documentation Viewer ©2025 | Built with 💻
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ProductCatalog2;
