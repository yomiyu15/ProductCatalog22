import React, { useState, useEffect } from "react";
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
  DownloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import PDFViewer from "./pdfviewer";
import { Link } from "react-router-dom";
import Logoimage from "../assets/images/bb.png";
import "antd/dist/reset.css";
import Fuse from "fuse.js"; // Fuzzy search library

const { Header, Sider, Content, Footer } = Layout;
const { Search } = Input;
const { SubMenu } = Menu;

const ProductCatalog2 = () => {
  // UI state variables
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [theme, setTheme] = useState("light"); // supports "light" or "dark"

  // Data and loading state
  const [folderStructure, setFolderStructure] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [fileMetadata, setFileMetadata] = useState(null);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    fetchFolderStructure();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchFolderStructure();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const fetchFolderStructure = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/folders/folder-structure"
      );
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
      const pdfUrl = `http://localhost:5000/api/files/view-pdf?folderPath=${encodeURIComponent(
        relativeFolderPath
      )}&fileName=${encodeURIComponent(fileName)}`;

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
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
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

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setFilteredFiles(value ? searchFiles(value) : []);
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
            onMouseEnter={() => {
              /* hover animation */
            }}
            onMouseLeave={() => {
              /* revert hover */
            }}
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
            <FileOutlined style={{ marginRight: 10 }} />
            {item.name.charAt(0).toUpperCase() +
              item.name.slice(1).toLowerCase()}
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
        <FileOutlined style={{ marginRight: 10 }} />
        {file.name}
      </Menu.Item>
    ));
  };

  const handleRefresh = () => {
    fetchFolderStructure();
  };


  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: theme === "light" ? "#f0f2f5" : "#141414",
        transition: "background 0.3s ease",
      }}
    >
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
          <Menu
            mode="inline"
            aria-label="File navigation menu"
            theme={theme === "light" ? "light" : "dark"}
          >
            {loading ? (
              <Spin aria-live="polite" />
            ) : searchQuery ? (
              renderFilteredFiles(filteredFiles)
            ) : (
              renderFolderItems(folderStructure)
            )}
          </Menu>
        </Drawer>
      ) : (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={400}
          theme={theme === "light" ? "light" : "dark"}
          style={{
            height: "100vh",
            position: "fixed",
            overflowY: "auto",
            transition: "all 0.3s ease",
          }}
          aria-label="File navigation sidebar"
        >
          <Search
            placeholder="Search Products"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            prefix={<SearchOutlined />}
            style={{
              margin: "0 20px 10px 20px",
              position: "sticky",
              top: 20,
              width: "calc(100% - 40px)", // Adjust width for responsiveness
              maxWidth: "500px", // Max width for larger screens
              zIndex: 1000,
              background: theme === "light" ? "#fff" : "#141414",
              padding: "12px 16px", // Slightly more padding for better touch targets
              borderRadius: "8px", // Rounded corners for modern look
              border: "1px solid", // Border to help with visibility
              borderColor: theme === "light" ? "#e0e0e0" : "#333", // Subtle border color change based on theme
           
            }}
            aria-label="Search products"
            onFocus={(e) =>
              (e.target.style.borderColor =
                theme === "light" ? "#3f87f2" : "#619cff")
            } // Focus style
            onBlur={(e) =>
              (e.target.style.borderColor =
                theme === "light" ? "#e0e0e0" : "#333")
            } // Reset border color on blur
            onMouseEnter={(e) =>
              (e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.1)")
            } // Hover shadow effect
            onMouseLeave={(e) =>
              (e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)")
            } // Reset shadow on mouse leave
          />

          <Menu
            mode="inline"
            aria-label="File navigation menu"
            theme={theme === "light" ? "light" : "dark"}
          >
            {loading ? (
              <Spin aria-live="polite" />
            ) : searchQuery ? (
              renderFilteredFiles(filteredFiles)
            ) : (
              renderFolderItems(folderStructure)
            )}
          </Menu>
        </Sider>
      )}

      <Layout style={{ marginLeft: isMobile ? 0 : collapsed ? 80 : 400 }}>
        <Header
          style={{
            background: theme === "light" ? "#fff" : "#1f1f1f",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            height: "64px", // Reduced header height
            position: "sticky",
            top: 0,
            zIndex: 1000,
            transition: "background 0.3s ease",
          }}
        >
          {isMobile ? (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              style={{ marginRight: 16 }}
              aria-label="Open navigation menu"
            />
          ) : (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ marginRight: 16 }}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            />
          )}
          <div style={{ flex: 1, textAlign: "center" }}>
            <Link
              to="/"
              style={{ display: "flex", alignItems: "center" }}
              aria-label="Go to Home"
            >
              <img
                src={Logoimage}
                alt="Bank Logo"
                title="Go to Home"
                style={{
                  width: collapsed ? 40 : 60,
                  transition: "width 0.3s ease",
                  marginRight: 8,
                }}
                role="img"
                aria-label="Bank Logo"
              />
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                  color: theme === "light" ? "#333" : "#fff",
                  transition: "color 0.3s ease",
                }}
              >
                Product Catalog
              </span>
            </Link>
          </div>
          <Space>
            <Tooltip title="Refresh Catalog">
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                style={{ color: "#00adef" }}
                aria-label="Refresh folder structure"
              />
            </Tooltip>
            <Tooltip
              title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              <Button
                type="text"
                icon={<BulbOutlined />}
                onClick={toggleTheme}
                style={{ color: "#00adef" }}
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } theme`}
                onMouseEnter={(e) => (e.target.style.color = "#ff7a7a")} // Hover effect
                onMouseLeave={(e) => (e.target.style.color = "#00adef")} // Reset color on leave
              />
            </Tooltip>
          </Space>
        </Header>

        <Content
  role="main"
  style={{
    margin: "10px",
    padding: "20px",
    marginLeft: "50px",
    background: theme === "light" ? "#fff" : "#141414",
    flexGrow: 1,
    width: "90%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    transition: "background-color 0.3s ease, color 0.3s ease",
    color: theme === "light" ? "#000" : "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  }}
>
  {/* Breadcrumbs */}
  {breadcrumbs.length > 0 && (
    <Breadcrumb
      style={{
        marginBottom: "5px",
        marginTop: "5px",
        fontSize: "14px",
        color: theme === "light" ? "#00adef" : "#40a9ff",
      }}
      aria-label="breadcrumb"
    >
      {["Home", ...breadcrumbs].slice(-3).map((breadcrumb) => (
        <Breadcrumb.Item key={breadcrumb.path}>
          <Link
            to={breadcrumb.path}
            title={`Go to ${breadcrumb.name}`}
            style={{
              color: theme === "light" ? "#00adef" : "#40a9ff",
              textDecoration: "none",
              transition: "color 0.3s ease",
              fontWeight: "500", // Improved visual emphasis
            }}
            onMouseEnter={(e) =>
              (e.target.style.color = theme === "light" ? "#40a9ff" : "#00adef")
            }
            onMouseLeave={(e) =>
              (e.target.style.color = theme === "light" ? "#00adef" : "#40a9ff")
            }
            aria-label={`Navigate to ${breadcrumb.name}`}
          >
            {breadcrumb.name}
          </Link>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  )}

  {/* File Details */}
  {selectedPdf && fileMetadata && (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        marginBottom: "16px",
        background: theme === "light" ? "#fafafa" : "#1f1f1f",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        transition: "background 0.3s ease",
      }}
    >
      <strong style={{ fontSize: "16px" }}>
        {fileMetadata.name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </strong>
    </div>
  )}

  {/* PDF Viewer or Loading State */}
  {pdfLoading ? (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Spin size="large" aria-live="polite" />
    </div>
  ) : selectedPdf ? (
    <div
      style={{
        animation: "fadeIn 0.3s ease", // Can be removed for performance if needed
        flex: 1,
        background: theme === "light" ? "#f5f5f5" : "#2a2a2a",
        borderRadius: "8px",
        overflow: "hidden",
        boxSizing: "border-box", // Ensure padding doesn’t overflow content
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PDFViewer file={selectedPdf} />
      </div>
    </div>
  ) : (
    <p style={{ textAlign: "center", fontSize: "18px", color: "#aaa" }}>
      Select a file to view.
    </p>
  )}
</Content>

        <Footer
          style={{
            textAlign: "center",
            background: theme === "light" ? "#fff" : "#1f1f1f",
            color: theme === "light" ? "#333" : "#fff", // Ensures text is readable on both themes
            padding: "10px 0", // Adds padding for better spacing
            transition: "background 0.3s ease, color 0.3s ease", // Smooth transition for theme switch
          }}
        >
          <span>
            © 2024 <strong>Product Catalog</strong>
          </span>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ProductCatalog2;
