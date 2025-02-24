import React, { useState, useEffect, useMemo } from "react";
import {
  Layout,
  Menu,
  Drawer,
  Button,
  Spin,
  Input,
  message,
  Breadcrumb,
  Tooltip,
  Space,
  Typography,
} from "antd";
import {
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FolderOpenOutlined,
  FileOutlined,
  SearchOutlined,
  BulbOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import PDFViewer from "./pdfviewer";
import { Link } from "react-router-dom";
import Logoimage from "../assets/images/bb.png";
import "antd/dist/reset.css";
import Fuse from "fuse.js";
import "./ProductCatalog.css";

const { Header, Sider, Content, Footer } = Layout;
const { Search } = Input;
const { SubMenu } = Menu;
const { Text } = Typography;

const ProductCatalog2 = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [theme, setTheme] = useState("light");
  const [folderStructure, setFolderStructure] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [fileMetadata, setFileMetadata] = useState(null);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    fetchFolderStructure();
    const interval = setInterval(fetchFolderStructure, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const fetchFolderStructure = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/folders/folder-structure");
      setFolderStructure(response.data);
    } catch (error) {
      message.error("Error fetching folder structure");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = (filePath) => {
    const normalizedPath = filePath.replace(/\\/g, "/");
    const pathParts = normalizedPath.split("/");
    const fileName = pathParts.pop().toLowerCase();
    const folderPath = pathParts.join("/");

    if (folderPath && fileName) {
      const relativeFolderPath = folderPath.replace(/^.*\/uploads\//, "");
      const pdfUrl = `http://localhost:5000/api/files/view-pdf?folderPath=${encodeURIComponent(relativeFolderPath)}&fileName=${encodeURIComponent(fileName)}`;

      setPdfLoading(true);
      axios
        .get(pdfUrl, { responseType: "blob" })
        .then((response) => {
          const pdfBlob = URL.createObjectURL(response.data);
          setSelectedPdf(pdfBlob);
          setFileMetadata({
            name: fileName,
            size: response.data.size,
          });
          const breadcrumbPath = relativeFolderPath
            .split("/")
            .map((folder, index, arr) => {
              const path = "/" + arr.slice(0, index + 1).join("/");
              return { path, name: folder };
            });
          setBreadcrumbs(breadcrumbPath);
        })
        .catch((error) => {
          message.error("Error loading PDF");
          console.error(error);
        })
        .finally(() => {
          setPdfLoading(false);
        });
    }
  };

  const getAllFiles = (items) => {
    let files = [];
    items.forEach((item) => {
      if (item.type === "file" && typeof item.name === "string") {
        const capitalizedName = item.name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
        files.push({ ...item, name: capitalizedName });
      }
      if (item.children && Array.isArray(item.children)) {
        files = [...files, ...getAllFiles(item.children)];
      }
    });
    return files;
  };

  const searchFiles = (query) => {
    if (!query) return [];
    const allFiles = getAllFiles(folderStructure);
    const options = { keys: ["name"], threshold: 0.3 };
    const fuse = new Fuse(allFiles, options);
    const results = fuse.search(query);
    return results.map((result) => result.item);
  };

  const filteredFiles = useMemo(() => searchFiles(searchQuery), [searchQuery, folderStructure]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const renderFolderItems = (items) => {
    return items.map((item) => {
      if (item.type === "folder") {
        return (
          <SubMenu
            key={item.name.toLowerCase()}
            title={
              <span>
                <FolderOpenOutlined style={{ marginRight: 8 }} />
                {item.name}
              </span>
            }
          >
            {item.children && renderFolderItems(item.children)}
          </SubMenu>
        );
      } else if (item.type === "file") {
        return (
          <Menu.Item
            key={item.name.toLowerCase()}
            onClick={() => handleFileClick(item.path)}
            aria-label={`File: ${item.name}`}
          >
            <FileOutlined style={{ marginRight: 8 }} />
            {item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}
          </Menu.Item>
        );
      }
      return null;
    });
  };

  const renderFilteredFiles = (files) => {
    return files.map((file) => (
      <Menu.Item
        key={file.name}
        onClick={() => handleFileClick(file.path)}
        aria-label={`File: ${file.name}`}
      >
        <FileOutlined style={{ marginRight: 8 }} />
        {file.name}
      </Menu.Item>
    ));
  };

  const handleRefresh = () => {
    fetchFolderStructure();
  };

  return (
    <Layout className={`product-catalog ${theme}`} style={{ minHeight: "100vh" }}>
      {isMobile ? (
        <Drawer
          title="Product Catalog"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={300}
          role="navigation"
          aria-label="File navigation"
        >
          <Search
            placeholder="Search files"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ marginBottom: "10px" }}
            aria-label="Search files"
          />
          <Menu mode="inline" aria-label="File navigation menu" theme={theme}>
            {loading ? <Spin aria-live="polite" /> : searchQuery ? renderFilteredFiles(filteredFiles) : renderFolderItems(folderStructure)}
          </Menu>
        </Drawer>
      ) : (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={350}
          theme={theme}
          className="sidebar"
          aria-label="File navigation sidebar"
        >
          <div className="sidebar-header">
            <Search
              placeholder="Search Products"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              prefix={<SearchOutlined />}
              className="search-bar"
              aria-label="Search products"
            />
          </div>
          <Menu mode="inline" aria-label="File navigation menu" theme={theme}>
            {loading ? <Spin aria-live="polite" /> : searchQuery ? renderFilteredFiles(filteredFiles) : renderFolderItems(folderStructure)}
          </Menu>
        </Sider>
      )}

      <Layout className="main-content" style={{ marginLeft: isMobile ? 0 : collapsed ? 80 : 350 }}>
        <Header className="header">
          {isMobile ? (
            <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerVisible(true)} aria-label="Open navigation menu" />
          ) : (
            <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} />
          )}
          <div className="logo-container">
            <Link to="/" aria-label="Go to Home">
              <img src={Logoimage} alt="Bank Logo" className="logo" />
           
            </Link>
          </div>
          <Space>
            <Tooltip title="Refresh Catalog">
              <Button type="text" icon={<ReloadOutlined />} onClick={handleRefresh} aria-label="Refresh folder structure" />
            </Tooltip>
            <Tooltip title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
              <Button type="text" icon={<BulbOutlined />} onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} />
            </Tooltip>
          </Space>
        </Header>

        <Content className="content" role="main">
        

       
          {breadcrumbs.length > 0 && (
            <Breadcrumb className="breadcrumb" aria-label="breadcrumb">
              {["Home", ...breadcrumbs].slice(-3).map((breadcrumb) => (
                <Breadcrumb.Item key={breadcrumb.path}>
                  <Link to={breadcrumb.path} aria-label={`Navigate to ${breadcrumb.name}`}>
                    {breadcrumb.name}
                  </Link>
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          )}

          {selectedPdf && fileMetadata && (
            <div className="file-metadata">
              <Text strong>{fileMetadata.name}</Text>
            </div>
          )}

          {pdfLoading ? (
            <div className="loading-spinner">
              <Spin size="large" aria-live="polite" />
            </div>
          ) : selectedPdf ? (
            <div className="pdf-viewer-container">
              <PDFViewer file={selectedPdf} />
            </div>
          ) : (
            <Text className="placeholder-text">Select a file to view.</Text>
          )}
        </Content>

        <Footer className="footer">
          <Text>© 2024 <strong>sector</strong></Text>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ProductCatalog2;