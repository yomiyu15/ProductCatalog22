import React, { useState, useEffect } from "react";
import { Layout, Menu, Drawer, Button, Spin, Input, message } from "antd";
import {
  MenuOutlined,
  FolderOpenOutlined,
  FileOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import PDFViewer from "./pdfviewer";
import { Link } from "react-router-dom";
import Logoimage from "../assets/images/bb.png";
import "antd/dist/reset.css";

const { Header, Sider, Content, Footer } = Layout;
const { Search } = Input;
const { SubMenu } = Menu;

const ProductCatalog2 = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [folderStructure, setFolderStructure] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    fetchFolderStructure();
  }, []);

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
    const fileName = pathParts.pop().toLowerCase(); // Convert to lowercase
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
      if (item.type === "file") {
        files.push({ ...item, name: item.name.toLowerCase() }); // Normalize to lowercase
      }
      if (item.children) {
        files = [...files, ...getAllFiles(item.children)];
      }
    });
    return files;
  };

  const searchFiles = (query) => {
    if (!query) return [];
    const allFiles = getAllFiles(folderStructure);
    return allFiles.filter((file) => file.name.includes(query.toLowerCase()));
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
          >
            {item.children && renderFolderItems(item.children)}
          </SubMenu>
        );
      } else if (item.type === "file") {
        return (
          <Menu.Item
            key={item.name.toLowerCase()}
            onClick={() => handleFileClick(item.path)}
          >
            <FileOutlined style={{ marginRight: 10 }} />
            {item.name.toLowerCase()}
          </Menu.Item>
        );
      }
      return null;
    });
  };

  const renderFilteredFiles = (files) => {
    return files.map((file) => (
      <Menu.Item key={file.name} onClick={() => handleFileClick(file.path)}>
        <FileOutlined style={{ marginRight: 10 }} />
        {file.name}
      </Menu.Item>
    ));
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isMobile ? (
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={250}
        >
          <Search
            placeholder="Search files"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ marginBottom: "10px" }}
          />
          <Menu mode="inline">
            {loading ? (
              <Spin />
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
          onCollapse={setCollapsed}
          width={350}
          style={{
            background: "#fff",
            height: "100vh",
            overflowY: "auto",
            transition: "width 0.3s",
          }}
        >
          <div style={{ textAlign: "center", padding: "10px" }}>
            <Link to="/">
              <img
                src={Logoimage}
                alt="Logo"
                style={{ width: collapsed ? 40 : 60, transition: "0.3s" }}
              />
            </Link>
          </div>
          <Search
            placeholder="Search Products"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ marginLeft: "30px", width: "80%" }}
          />
          <Menu mode="inline">
            {loading ? (
              <Spin />
            ) : searchQuery ? (
              renderFilteredFiles(filteredFiles)
            ) : (
              renderFolderItems(folderStructure)
            )}
          </Menu>
        </Sider>
      )}
      <Layout>
        <Header
          style={{
            background: "#fff",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              style={{ marginRight: 16 }}
            />
          )}
          <h3 style={{ flex: 1, textAlign: "center" }}>Product Catalog</h3>
        </Header>
        <Content
          style={{
            margin: "8px",
            padding: 24,
            background: "#fff",
            flexGrow: 1,
            height: "100vh",
          }}
        >
          {pdfLoading ? (
            <Spin />
          ) : selectedPdf ? (
            <PDFViewer file={selectedPdf} />
          ) : (
            <p>Select a file to view.</p>
          )}
        </Content>

        <Footer
          style={{
            textAlign: "center",
            background: "#fff",
            padding: "16px 0",
            borderTop: "1px solid #ddd",
          }}
        >
          &copy; {new Date().getFullYear()} Your Company Name. All rights
          reserved.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ProductCatalog2;
