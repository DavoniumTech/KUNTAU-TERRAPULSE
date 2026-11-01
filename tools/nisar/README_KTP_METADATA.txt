KUNTAU TERRAPULSE - NISAR METADATA RETRIEVAL

1. Extract this folder somewhere on your computer.
2. Open OSGeo4W Shell.
3. Change directory into the extracted folder, for example:
   cd /d "%USERPROFILE%\Downloads\ktp_metadata_tool"
4. Check/install ASF search package:
   python -m pip install --user asf_search
5. Retrieve small catalog metadata first (recommended):
   python GET_KTP_NISAR_METADATA.py
6. Review the output folder KTP_NISAR_METADATA.
7. If you also want the original large HDF5 science products:
   python GET_KTP_NISAR_METADATA.py --download
   It will show the catalog-reported size where available and ask you to type DOWNLOAD.
   You will then enter your Earthdata Login username and password interactively.

The script does not store your password. Never put Earthdata credentials in a public
GitHub repository or send them in chat. Metadata-only mode does not download HDF5.
